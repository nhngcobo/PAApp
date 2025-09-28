namespace Backend.Models.AIAnalytics
{
    /// <summary>
    /// Comprehensive AI analysis result for a team's capabilities, risks, and recommendations
    /// </summary>
    public class AITeamAnalysis
    {
        /// <summary>
        /// Key strengths and competitive advantages of the team
        /// </summary>
        public List<string> TeamStrengths { get; set; } = new();

        /// <summary>
        /// Potential risks and challenges that could impact project delivery
        /// </summary>
        public List<string> RiskFactors { get; set; } = new();

        /// <summary>
        /// Actionable recommendations for team optimization and risk mitigation
        /// </summary>
        public List<string> Recommendations { get; set; } = new();

        /// <summary>
        /// Assessment of what types of projects this team would excel at
        /// </summary>
        public string ProjectSuitability { get; set; } = "";

        /// <summary>
        /// Critical skill gaps that need to be addressed
        /// </summary>
        public List<string> SkillGaps { get; set; } = new();

        /// <summary>
        /// Analysis of team collaboration potential and dynamics
        /// </summary>
        public string TeamDynamics { get; set; } = "";

        /// <summary>
        /// Overall delivery risk assessment with explanation
        /// </summary>
        public string DeliveryRisk { get; set; } = "MEDIUM - Assessment in progress";

        /// <summary>
        /// Key strategic insights for project management decisions
        /// </summary>
        public List<string> KeyInsights { get; set; } = new();

        /// <summary>
        /// Confidence score of the AI analysis (0-100)
        /// </summary>
        public int ConfidenceScore { get; set; } = 85;

        /// <summary>
        /// Timestamp when the analysis was generated
        /// </summary>
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Gets the risk level enum from the delivery risk string
        /// </summary>
        public RiskLevel RiskLevel
        {
            get
            {
                if (DeliveryRisk.StartsWith("LOW", StringComparison.OrdinalIgnoreCase))
                    return RiskLevel.Low;
                if (DeliveryRisk.StartsWith("HIGH", StringComparison.OrdinalIgnoreCase))
                    return RiskLevel.High;
                return RiskLevel.Medium;
            }
        }

        /// <summary>
        /// Validates that the analysis has all required components
        /// </summary>
        public bool IsComplete => 
            TeamStrengths.Any() && 
            !string.IsNullOrEmpty(ProjectSuitability) && 
            !string.IsNullOrEmpty(TeamDynamics) && 
            !string.IsNullOrEmpty(DeliveryRisk);
    }

    /// <summary>
    /// Risk level enumeration for delivery risk assessment
    /// </summary>
    public enum RiskLevel
    {
        Low = 1,
        Medium = 2,
        High = 3
    }
}