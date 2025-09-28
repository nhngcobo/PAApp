using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Backend.Models;
using Backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure;
using Azure.AI.OpenAI;

namespace Backend.Services
{
    public class EmployeeService(IEmployeeRepository repo)
    {
        private readonly IEmployeeRepository _repo = repo;

        public Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            return _repo.GetAllAsync();
        }

        public async Task<IEnumerable<EmployeeMatchResult>> MatchEmployeesAsync(MatchRequest request)
        {
            Console.WriteLine($"MatchEmployeesAsync called with skills: [{string.Join(", ", request.Skills ?? new List<string>())}], technologies: [{string.Join(", ", request.Technologies ?? new List<string>())}]");
            
            // If no skills or technologies are selected, return empty result
            if ((request.Skills == null || !request.Skills.Any()) && (request.Technologies == null || !request.Technologies.Any()))
            {
                Console.WriteLine("No skills or technologies provided, returning empty result");
                return new List<EmployeeMatchResult>();
            }
            
            var all = (await _repo.GetAllAsync()).ToList();
            Console.WriteLine($"Found {all.Count} employees in database");
            
            if (!all.Any())
            {
                Console.WriteLine("No employees found in database");
                return new List<EmployeeMatchResult>();
            }
            
            var endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT") ?? "https://...-openai-dev.openai.azure.com/";
            var key = Environment.GetEnvironmentVariable("AZURE_OPENAI_KEY") ?? " ";
            var deployment = "model-router";
            var client = new OpenAIClient(new Uri(endpoint), new AzureKeyCredential(key));

            var prompt = BuildPrompt(request, all);
            Console.WriteLine($"Generated prompt:\n{prompt}");
            
            var options = new ChatCompletionsOptions();
            options.Messages.Add(new ChatMessage(ChatRole.System, "You are an expert project staffing assistant. Given project requirements and a list of employees, return a JSON array of objects with employee IDs and their match scores."));
            options.Messages.Add(new ChatMessage(ChatRole.User, prompt));
            options.Temperature = 0.3f; // Lower temperature for more consistent scoring
            options.MaxTokens = 8192;
            options.FrequencyPenalty = 0f;
            options.PresencePenalty = 0f;

            options.DeploymentName = deployment;
            
            try
            {
                Console.WriteLine("Calling Azure OpenAI...");
                var response = await client.GetChatCompletionsAsync(options);
                var content = response.Value.Choices[0].Message.Content;
                Console.WriteLine($"AI Response:\n{content}");
                
                var matchResults = ParseMatchResultsFromAI(content);
                Console.WriteLine($"Parsed {matchResults.Count} match results from AI response");

                var results = all.Where(e => matchResults.ContainsKey(e.Id))
                              .Select(e => new EmployeeMatchResult { 
                                  Employee = e, 
                                  MatchScore = matchResults[e.Id] 
                              })
                              .OrderByDescending(r => r.MatchScore)
                              .ToList();
                              
                Console.WriteLine($"Returning {results.Count} matched employees");
                return results;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error calling Azure OpenAI: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        private string BuildPrompt(MatchRequest request, List<Employee> employees)
        {
            var skills = request.Skills != null && request.Skills.Any() ? string.Join(", ", request.Skills) : "None";
            var technologies = request.Technologies != null && request.Technologies.Any() ? string.Join(", ", request.Technologies) : "None";

            var employeeList = string.Join("\n", employees.Select(e => 
                $"ID: {e.Id}, Name: {e.Name}, Skills: {e.Skills ?? "None"}, Technologies: {e.Technologies ?? "None"}"));

            return $@"I need to match employees for a project with the following requirements:

**Required Skills:** {skills}
**Required Technologies:** {technologies}

**Available Employees:**
{employeeList}

IMPORTANT: You must respond with ONLY a valid JSON array in this exact format:
[
  {{""employeeId"": 1, ""matchScore"": 0.85}},
  {{""employeeId"": 2, ""matchScore"": 0.72}},
  {{""employeeId"": 3, ""matchScore"": 0.45}}
]

Match scoring criteria:
- Calculate match score as a decimal between 0.0 and 1.0
- Consider both skills and technologies alignment with the requirements
- Higher scores (0.7-1.0) for employees with strong alignment to required skills/technologies
- Medium scores (0.4-0.6) for employees with some relevant skills/technologies
- Lower scores (0.1-0.3) for employees with minimal alignment
- Include ALL employees with scores, even low ones
- Use employeeId field (not employee_id or id)
- Use matchScore field (not match_score or score)

Respond with ONLY the JSON array, no explanations or additional text.";
        }

        private Dictionary<int, double> ParseMatchResultsFromAI(string content)
        {
            Console.WriteLine($"Attempting to parse AI response: {content}");
            
            try
            {
                // Try to find a JSON array in the content
                var start = content.IndexOf('[');
                var end = content.LastIndexOf(']');
                
                Console.WriteLine($"JSON array boundaries: start={start}, end={end}");
                
                if (start >= 0 && end > start)
                {
                    var arrStr = content.Substring(start, end - start + 1);
                    Console.WriteLine($"Extracted JSON array: {arrStr}");
                    
                    var matchResults = JsonSerializer.Deserialize<List<EmployeeMatchDto>>(arrStr);
                    Console.WriteLine($"Deserialized {matchResults?.Count ?? 0} match results");
                    
                    var dict = matchResults?.ToDictionary(m => m.EmployeeId, m => m.MatchScore) ?? new Dictionary<int, double>();
                    Console.WriteLine($"Created dictionary with {dict.Count} entries");
                    
                    return dict;
                }
                else
                {
                    Console.WriteLine("Could not find valid JSON array boundaries in AI response");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing AI response: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
            
            return new Dictionary<int, double>();
        }

        public async Task<(bool Success, string Message)> UploadEmployeeAsync(EmployeeUploadRequest request, string? avatarUrl)
        {
            try
            {
                var employee = new Employee
                {
                    Name = request.Name,
                    Email = request.Email,
                    Role = request.Role,
                    Skills = request.Skills,
                    Technologies = request.Technologies,
                    Department = request.Department ?? "General",
                    ExperienceYears = request.ExperienceYears ?? 0,
                    Rating = request.Rating,
                    AvatarUrl = avatarUrl,
                    IsOnProject = request.IsOnProject,
                    CurrentProjectName = request.CurrentProjectName,
                    ProjectEndDate = request.ProjectEndDate
                };

                await _repo.AddAsync(employee);
                return (true, "Employee uploaded successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading employee: {ex.Message}");
                return (false, $"Error uploading employee: {ex.Message}");
            }
        }

        public async Task<(bool Success, string Message)> UpdateEmployeeAsync(int id, EmployeeUploadRequest request, string? avatarUrl)
        {
            try
            {
                var existingEmployee = await _repo.GetByIdAsync(id);
                if (existingEmployee == null)
                {
                    return (false, "Employee not found");
                }

                // Update employee with new data
                existingEmployee.Name = request.Name;
                existingEmployee.Email = request.Email;
                existingEmployee.Role = request.Role;
                existingEmployee.Skills = request.Skills;
                existingEmployee.Technologies = request.Technologies;
                existingEmployee.Department = request.Department ?? existingEmployee.Department;
                existingEmployee.ExperienceYears = request.ExperienceYears ?? existingEmployee.ExperienceYears;
                existingEmployee.Rating = request.Rating ?? existingEmployee.Rating;
                existingEmployee.IsOnProject = request.IsOnProject;
                existingEmployee.CurrentProjectName = request.CurrentProjectName;
                existingEmployee.ProjectEndDate = request.ProjectEndDate;
                
                // Only update avatar if a new one is provided
                if (!string.IsNullOrEmpty(avatarUrl))
                {
                    existingEmployee.AvatarUrl = avatarUrl;
                }

                var success = await _repo.UpdateAsync(existingEmployee);
                return success ? (true, "Employee updated successfully") : (false, "Failed to update employee");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating employee: {ex.Message}");
                return (false, $"Error updating employee: {ex.Message}");
            }
        }

        private class EmployeeMatchDto
        {
            [JsonPropertyName("employeeId")]
            public int EmployeeId { get; set; }
            
            [JsonPropertyName("matchScore")]
            public double MatchScore { get; set; }
        }
    }
}
