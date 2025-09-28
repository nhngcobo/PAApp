using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models.AIAnalytics;
using System.Diagnostics;

namespace Backend.Controllers
{
    /// <summary>
    /// Controller for AI-powered team analysis and insights
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AIAnalyticsController : ControllerBase
    {
        private readonly IAIAnalyticsService _aiAnalyticsService;
        private readonly ILogger<AIAnalyticsController> _logger;

        public AIAnalyticsController(
            IAIAnalyticsService aiAnalyticsService, 
            ILogger<AIAnalyticsController> logger)
        {
            _aiAnalyticsService = aiAnalyticsService;
            _logger = logger;
        }

        /// <summary>
        /// Analyzes a team using AI to provide insights, risks, and recommendations
        /// </summary>
        /// <param name="request">Team analysis request with profile data</param>
        /// <returns>Comprehensive AI team analysis</returns>
        [HttpPost("team-analysis")]
        public async Task<IActionResult> AnalyzeTeamWithAI([FromBody] AITeamAnalysisRequest request)
        {
            var stopwatch = Stopwatch.StartNew();
            
            try 
            {
                _logger.LogInformation("Received team analysis request for {TotalMembers} members", 
                    request.TeamProfile.TotalMembers);

                // Validate request
                if (!_aiAnalyticsService.ValidateTeamProfile(request.TeamProfile))
                {
                    return BadRequest(new { message = "Invalid team profile: Please check team member counts, experience values, and match scores are within valid ranges" });
                }

                // Get AI analysis from service
                var response = await _aiAnalyticsService.AnalyzeTeamAsync(request);
                
                stopwatch.Stop();
                _logger.LogInformation("Team analysis completed in {ElapsedMs}ms with {Success} status", 
                    stopwatch.ElapsedMilliseconds, response.Success ? "success" : "fallback");

                if (response.Success)
                {
                    return Ok(response.Analysis);
                }
                else
                {
                    // Still return the analysis but with a warning header
                    Response.Headers["X-Analysis-Warning"] = response.ErrorMessage ?? "Using fallback analysis";
                    return Ok(response.Analysis);
                }
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                _logger.LogError(ex, "Error processing team analysis request");
                
                return StatusCode(500, new 
                { 
                    message = "Internal server error during team analysis",
                    details = ex.Message,
                    processingTimeMs = stopwatch.ElapsedMilliseconds
                });
            }
        }

        /// <summary>
        /// Gets health status of the AI analytics service
        /// </summary>
        /// <returns>Service health information</returns>
        [HttpGet("health")]
        public async Task<IActionResult> GetServiceHealth()
        {
            try
            {
                var healthStatus = await _aiAnalyticsService.GetServiceHealthAsync();
                return Ok(healthStatus);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking service health");
                return StatusCode(500, new
                {
                    isHealthy = false,
                    status = "Unhealthy",
                    error = ex.Message,
                    lastChecked = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Analyzes multiple teams for comparison
        /// </summary>
        /// <param name="requests">Array of team analysis requests</param>
        /// <returns>Comparative analysis of teams</returns>
        [HttpPost("compare-teams")]
        public async Task<IActionResult> CompareTeams([FromBody] AITeamAnalysisRequest[] requests)
        {
            try
            {
                if (requests == null || requests.Length < 2)
                {
                    return BadRequest(new { message = "At least 2 teams required for comparison" });
                }

                if (requests.Length > 5)
                {
                    return BadRequest(new { message = "Maximum 5 teams can be compared at once" });
                }

                var analyses = new List<AITeamAnalysis>();
                
                foreach (var request in requests)
                {
                    var response = await _aiAnalyticsService.AnalyzeTeamAsync(request);
                    analyses.Add(response.Analysis);
                }

                // Generate comparison insights
                var comparison = GenerateTeamComparison(analyses);

                return Ok(comparison);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error comparing teams");
                return StatusCode(500, new { message = "Error during team comparison", details = ex.Message });
            }
        }

        /// <summary>
        /// Generates comparative analysis between multiple teams
        /// </summary>
        private object GenerateTeamComparison(List<AITeamAnalysis> analyses)
        {
            return new
            {
                teamCount = analyses.Count,
                timestamp = DateTime.UtcNow,
                overallInsights = new[]
                {
                    $"Analyzed {analyses.Count} teams for comparative assessment",
                    $"Risk levels: {analyses.Count(a => a.RiskLevel == RiskLevel.Low)} low, " +
                    $"{analyses.Count(a => a.RiskLevel == RiskLevel.Medium)} medium, " +
                    $"{analyses.Count(a => a.RiskLevel == RiskLevel.High)} high",
                    $"Average confidence score: {analyses.Average(a => a.ConfidenceScore):F1}%"
                },
                teams = analyses.Select((analysis, index) => new
                {
                    teamIndex = index + 1,
                    riskLevel = analysis.RiskLevel.ToString(),
                    strengthCount = analysis.TeamStrengths.Count,
                    riskCount = analysis.RiskFactors.Count,
                    recommendationCount = analysis.Recommendations.Count,
                    confidenceScore = analysis.ConfidenceScore,
                    summary = analysis.ProjectSuitability
                }).ToArray()
            };
        }
    }
}