using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly TeamAnalyticsService _analyticsService;

        public AnalyticsController(TeamAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpPost("team-effectiveness")]
        public async Task<IActionResult> AnalyzeTeamEffectiveness([FromBody] TeamAnalysisRequest request)
        {
            try
            {
                var report = await _analyticsService.AnalyzeTeamEffectivenessAsync(
                    request.EmployeeIds, 
                    request.ProjectRequirements);
                
                return Ok(report);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("capacity-forecast")]
        public async Task<IActionResult> GetCapacityForecast([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var start = startDate ?? DateTime.UtcNow;
                var end = endDate ?? DateTime.UtcNow.AddMonths(12);
                
                var forecast = await _analyticsService.GenerateCapacityForecastAsync(start, end);
                return Ok(forecast);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("skill-gaps")]
        public async Task<IActionResult> GetSkillGapAnalysis()
        {
            try
            {
                var skillGaps = await _analyticsService.AnalyzeOrganizationalSkillGapsAsync();
                return Ok(skillGaps);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("dashboard-metrics")]
        public async Task<IActionResult> GetDashboardMetrics()
        {
            try
            {
                // Get capacity forecast for next 6 months
                var capacityForecast = await _analyticsService.GenerateCapacityForecastAsync(
                    DateTime.UtcNow, DateTime.UtcNow.AddMonths(6));

                // Get skill gap analysis
                var skillGaps = await _analyticsService.AnalyzeOrganizationalSkillGapsAsync();

                var metrics = new DashboardMetrics
                {
                    CapacityForecast = capacityForecast,
                    SkillGaps = skillGaps.Take(10).ToList(), // Top 10 gaps
                    GeneratedAt = DateTime.UtcNow
                };

                return Ok(metrics);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class TeamAnalysisRequest
    {
        public List<int> EmployeeIds { get; set; } = new();
        public string ProjectRequirements { get; set; } = string.Empty;
    }

    public class DashboardMetrics
    {
        public CapacityForecast CapacityForecast { get; set; } = new();
        public List<SkillGapAnalysis> SkillGaps { get; set; } = new();
        public DateTime GeneratedAt { get; set; }
    }
}