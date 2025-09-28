using Backend.Models;
using System.Text.Json;

namespace Backend.Services
{
    public class TeamAnalyticsService
    {
        private readonly EmployeeService _employeeService;

        public TeamAnalyticsService(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        public async Task<TeamEffectivenessReport> AnalyzeTeamEffectivenessAsync(List<int> employeeIds, string projectRequirements)
        {
            var allEmployees = await _employeeService.GetAllEmployeesAsync();
            var employees = allEmployees.Where(e => employeeIds.Contains(e.Id)).ToList();

            var report = new TeamEffectivenessReport
            {
                TeamId = Guid.NewGuid().ToString(),
                AnalysisDate = DateTime.UtcNow,
                TeamMembers = employees.Select(e => new TeamMemberSummary
                {
                    EmployeeId = e.Id,
                    Name = e.Name,
                    Role = e.Role,
                    Skills = e.Skills.Split(',').Select(s => s.Trim()).ToList(),
                    ExperienceYears = e.ExperienceYears,
                    Rating = e.Rating ?? 0
                }).ToList()
            };

            // Calculate skill coverage
            report.SkillsCoverage = CalculateSkillsCoverage(report.TeamMembers, projectRequirements);
            
            // Calculate experience balance
            report.ExperienceBalance = CalculateExperienceBalance(report.TeamMembers);
            
            // Calculate team synergy using AI
            report.TeamSynergy = await CalculateTeamSynergyAsync(report.TeamMembers);
            
            // Overall effectiveness score
            report.OverallEffectiveness = (report.SkillsCoverage + report.ExperienceBalance + report.TeamSynergy) / 3;

            // Generate insights
            report.Insights = await GenerateTeamInsightsAsync(report);

            // Identify potential risks
            report.Risks = IdentifyTeamRisks(report);

            // Suggest improvements
            report.Recommendations = await GenerateRecommendationsAsync(report, projectRequirements);

            return report;
        }

        private double CalculateSkillsCoverage(List<TeamMemberSummary> teamMembers, string projectRequirements)
        {
            var requiredSkills = ExtractRequiredSkills(projectRequirements);
            var teamSkills = teamMembers.SelectMany(m => m.Skills).Distinct().ToHashSet();
            
            var coveredSkills = requiredSkills.Count(skill => 
                teamSkills.Any(teamSkill => 
                    teamSkill.Contains(skill, StringComparison.OrdinalIgnoreCase)));

            return requiredSkills.Any() ? (double)coveredSkills / requiredSkills.Count * 100 : 100;
        }

        private double CalculateExperienceBalance(List<TeamMemberSummary> teamMembers)
        {
            if (!teamMembers.Any()) return 0;

            var avgExperience = teamMembers.Average(m => m.ExperienceYears);
            var experienceVariance = teamMembers.Sum(m => Math.Pow(m.ExperienceYears - avgExperience, 2)) / teamMembers.Count;
            var experienceStdDev = Math.Sqrt(experienceVariance);

            // Good balance means low standard deviation with reasonable average
            var balanceScore = Math.Max(0, 100 - (experienceStdDev * 10));
            var experienceScore = Math.Min(100, avgExperience * 10); // Cap at 100

            return (balanceScore + experienceScore) / 2;
        }

        private Task<double> CalculateTeamSynergyAsync(List<TeamMemberSummary> teamMembers)
        {
            // Use fallback calculation (no AI dependency)
            return Task.FromResult(CalculateFallbackSynergy(teamMembers));
        }

        private double CalculateFallbackSynergy(List<TeamMemberSummary> teamMembers)
        {
            // Simple heuristic: diversity of roles and balanced ratings
            var uniqueRoles = teamMembers.Select(m => m.Role).Distinct().Count();
            var avgRating = teamMembers.Average(m => (double)m.Rating);
            var ratingVariance = teamMembers.Sum(m => Math.Pow((double)m.Rating - avgRating, 2)) / teamMembers.Count;

            var diversityScore = Math.Min(100, uniqueRoles * 25); // More roles = better
            var qualityScore = avgRating * 20; // Higher avg rating = better
            var consistencyScore = Math.Max(0, 100 - (ratingVariance * 50)); // Lower variance = better

            return (diversityScore + qualityScore + consistencyScore) / 3;
        }

        private Task<List<string>> GenerateTeamInsightsAsync(TeamEffectivenessReport report)
        {
            var insights = new List<string>();

            // Skills insights
            if (report.SkillsCoverage >= 90)
                insights.Add("🎯 Excellent skills coverage - all critical requirements are met");
            else if (report.SkillsCoverage >= 70)
                insights.Add("⚠️ Good skills coverage with minor gaps to address");
            else
                insights.Add("🚨 Significant skill gaps identified - consider additional team members");

            // Experience insights
            if (report.ExperienceBalance >= 80)
                insights.Add("👥 Well-balanced team with good mix of experience levels");
            else if (report.ExperienceBalance >= 60)
                insights.Add("📊 Moderate experience balance - some adjustment may be beneficial");
            else
                insights.Add("⚖️ Experience imbalance - consider rebalancing senior/junior ratio");

            // Synergy insights
            if (report.TeamSynergy >= 85)
                insights.Add("✨ High team synergy expected - complementary skills and roles");
            else if (report.TeamSynergy >= 65)
                insights.Add("🤝 Good team compatibility with room for optimization");
            else
                insights.Add("🔄 Team composition may benefit from restructuring");

            return Task.FromResult(insights);
        }

        private List<string> IdentifyTeamRisks(TeamEffectivenessReport report)
        {
            var risks = new List<string>();

            // Single points of failure
            var skillCounts = report.TeamMembers
                .SelectMany(m => m.Skills)
                .GroupBy(s => s)
                .Where(g => g.Count() == 1)
                .Select(g => g.Key);

            if (skillCounts.Any())
                risks.Add($"🎯 Single points of failure in: {string.Join(", ", skillCounts.Take(3))}");

            // Experience gaps
            var maxExp = report.TeamMembers.Max(m => m.ExperienceYears);
            var minExp = report.TeamMembers.Min(m => m.ExperienceYears);
            
            if (maxExp - minExp > 8)
                risks.Add("📈 Large experience gap may affect team dynamics");

            // Overloaded roles
            var roleCounts = report.TeamMembers
                .GroupBy(m => m.Role)
                .Where(g => g.Count() > 2)
                .Select(g => g.Key);

            if (roleCounts.Any())
                risks.Add($"👥 Potential role overlap in: {string.Join(", ", roleCounts)}");

            return risks;
        }

        private Task<List<string>> GenerateRecommendationsAsync(TeamEffectivenessReport report, string projectRequirements)
        {
            var recommendations = new List<string>();

            // Skill gap recommendations
            var requiredSkills = ExtractRequiredSkills(projectRequirements);
            var teamSkills = report.TeamMembers.SelectMany(m => m.Skills).Distinct().ToHashSet();
            var missingSkills = requiredSkills.Where(skill => 
                !teamSkills.Any(teamSkill => teamSkill.Contains(skill, StringComparison.OrdinalIgnoreCase))).ToList();

            if (missingSkills.Any())
                recommendations.Add($"🔍 Consider adding team member(s) with: {string.Join(", ", missingSkills.Take(3))}");

            // Experience recommendations
            var avgExperience = report.TeamMembers.Average(m => m.ExperienceYears);
            if (avgExperience < 3)
                recommendations.Add("🎓 Consider adding a senior team member for mentorship and guidance");
            else if (avgExperience > 10)
                recommendations.Add("🌱 Consider adding junior members to balance cost and bring fresh perspectives");

            // Performance recommendations
            var lowPerformers = report.TeamMembers.Where(m => m.Rating < 3.5m).ToList();
            if (lowPerformers.Any())
                recommendations.Add($"⚡ Consider additional support or training for team members with lower ratings");

            return Task.FromResult(recommendations);
        }

        private List<string> ExtractRequiredSkills(string projectRequirements)
        {
            // Simple extraction - in real implementation, use NLP or predefined skill dictionary
            var commonSkills = new[]
            {
                "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C#",
                "SQL", "Azure", "AWS", "Docker", "Kubernetes", "Git", "Figma", "Design",
                "Project Management", "Agile", "Scrum", "Testing", "DevOps"
            };

            return commonSkills.Where(skill => 
                projectRequirements.Contains(skill, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        public async Task<CapacityForecast> GenerateCapacityForecastAsync(DateTime startDate, DateTime endDate)
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            
            var forecast = new CapacityForecast
            {
                StartDate = startDate,
                EndDate = endDate,
                TotalEmployees = employees.Count(),
                ForecastData = new List<CapacityData>()
            };

            // Calculate capacity for each month
            var current = startDate;
            while (current <= endDate)
            {
                var availableCount = employees.Count(e => 
                    !e.IsOnProject || 
                    (e.ProjectEndDate.HasValue && e.ProjectEndDate.Value <= current));

                var becomingAvailable = employees.Count(e => 
                    e.IsOnProject && 
                    e.ProjectEndDate.HasValue && 
                    e.ProjectEndDate.Value.Year == current.Year && 
                    e.ProjectEndDate.Value.Month == current.Month);

                forecast.ForecastData.Add(new CapacityData
                {
                    Date = current,
                    AvailableEmployees = availableCount,
                    BecomingAvailable = becomingAvailable,
                    UtilizationRate = (double)(employees.Count() - availableCount) / employees.Count() * 100
                });

                current = current.AddMonths(1);
            }

            return forecast;
        }

        public async Task<List<SkillGapAnalysis>> AnalyzeOrganizationalSkillGapsAsync()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            var allSkills = employees.SelectMany(e => e.Skills.Split(',').Select(s => s.Trim())).ToList();
            
            var skillCounts = allSkills
                .GroupBy(s => s)
                .ToDictionary(g => g.Key, g => g.Count());

            var totalEmployees = employees.Count();
            var skillGaps = new List<SkillGapAnalysis>();

            // Define critical skills for the organization
            var criticalSkills = new[]
            {
                "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C#",
                "SQL Server", "Azure", "AWS", "DevOps", "Docker", "Kubernetes",
                "Project Management", "Agile", "UI/UX Design", "Data Analysis"
            };

            foreach (var skill in criticalSkills)
            {
                var currentCount = skillCounts.GetValueOrDefault(skill, 0);
                var coveragePercentage = (double)currentCount / totalEmployees * 100;
                
                // Determine if this is a gap (less than 20% coverage for critical skills)
                var isGap = coveragePercentage < 20;
                var recommendedCount = Math.Max(currentCount, (int)Math.Ceiling(totalEmployees * 0.2));

                skillGaps.Add(new SkillGapAnalysis
                {
                    SkillName = skill,
                    CurrentCount = currentCount,
                    RecommendedCount = recommendedCount,
                    CoveragePercentage = coveragePercentage,
                    IsGap = isGap,
                    Priority = DetermineSkillPriority(skill, coveragePercentage)
                });
            }

            return skillGaps.OrderByDescending(s => s.Priority).ThenBy(s => s.CoveragePercentage).ToList();
        }

        private SkillPriority DetermineSkillPriority(string skill, double coverage)
        {
            var highPrioritySkills = new[] { "JavaScript", "React", "Node.js", "SQL Server", "Azure" };
            
            if (highPrioritySkills.Contains(skill) && coverage < 15)
                return SkillPriority.Critical;
            if (coverage < 10)
                return SkillPriority.High;
            if (coverage < 20)
                return SkillPriority.Medium;
            
            return SkillPriority.Low;
        }
    }

    // Supporting Models
    public class TeamEffectivenessReport
    {
        public string TeamId { get; set; } = string.Empty;
        public DateTime AnalysisDate { get; set; }
        public List<TeamMemberSummary> TeamMembers { get; set; } = new();
        public double SkillsCoverage { get; set; }
        public double ExperienceBalance { get; set; }
        public double TeamSynergy { get; set; }
        public double OverallEffectiveness { get; set; }
        public List<string> Insights { get; set; } = new();
        public List<string> Risks { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
    }

    public class TeamMemberSummary
    {
        public int EmployeeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
        public int ExperienceYears { get; set; }
        public decimal Rating { get; set; }
    }

    public class CapacityForecast
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalEmployees { get; set; }
        public List<CapacityData> ForecastData { get; set; } = new();
    }

    public class CapacityData
    {
        public DateTime Date { get; set; }
        public int AvailableEmployees { get; set; }
        public int BecomingAvailable { get; set; }
        public double UtilizationRate { get; set; }
    }

    public class SkillGapAnalysis
    {
        public string SkillName { get; set; } = string.Empty;
        public int CurrentCount { get; set; }
        public int RecommendedCount { get; set; }
        public double CoveragePercentage { get; set; }
        public bool IsGap { get; set; }
        public SkillPriority Priority { get; set; }
    }

    public enum SkillPriority
    {
        Low,
        Medium,
        High,
        Critical
    }
}