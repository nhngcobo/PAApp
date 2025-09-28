using Backend.Models.AIAnalytics;

namespace Backend.Services
{
    /// <summary>
    /// Interface for AI-powered team analysis services
    /// </summary>
    public interface IAIAnalyticsService
    {
        /// <summary>
        /// Generates comprehensive AI analysis for a team profile
        /// </summary>
        /// <param name="request">Team analysis request containing profile and focus areas</param>
        /// <returns>Complete AI analysis with insights and recommendations</returns>
        Task<AITeamAnalysisResponse> AnalyzeTeamAsync(AITeamAnalysisRequest request);

        /// <summary>
        /// Validates a team profile for analysis
        /// </summary>
        /// <param name="profile">Team profile to validate</param>
        /// <returns>True if profile is valid for analysis</returns>
        bool ValidateTeamProfile(TeamProfile profile);

        /// <summary>
        /// Gets the health status of the AI analytics service
        /// </summary>
        /// <returns>Service health information</returns>
        Task<ServiceHealthStatus> GetServiceHealthAsync();
    }

    /// <summary>
    /// Service health status information
    /// </summary>
    public class ServiceHealthStatus
    {
        public bool IsHealthy { get; set; } = true;
        public string Status { get; set; } = "Healthy";
        public DateTime LastChecked { get; set; } = DateTime.UtcNow;
        public List<string> AvailableFeatures { get; set; } = new();
        public string Version { get; set; } = "1.0.0";
    }
}