namespace Backend.Models.AIAnalytics
{
    /// <summary>
    /// Request model for AI team analysis
    /// </summary>
    public class AITeamAnalysisRequest
    {
        /// <summary>
        /// Team profile data for analysis
        /// </summary>
        public TeamProfile TeamProfile { get; set; } = new();

        /// <summary>
        /// Optional context about the project type or requirements
        /// </summary>
        public string? ProjectContext { get; set; }

        /// <summary>
        /// Specific areas of focus for the analysis
        /// </summary>
        public List<AnalysisFocus> FocusAreas { get; set; } = new();

        /// <summary>
        /// Whether to include detailed insights in the response
        /// </summary>
        public bool IncludeDetailedInsights { get; set; } = true;
    }

    /// <summary>
    /// Areas of focus for AI analysis
    /// </summary>
    public enum AnalysisFocus
    {
        SkillAssessment,
        RiskAnalysis,
        TeamDynamics,
        ProjectSuitability,
        CapacityPlanning,
        SkillGapAnalysis
    }

    /// <summary>
    /// Response model for AI team analysis
    /// </summary>
    public class AITeamAnalysisResponse
    {
        /// <summary>
        /// The comprehensive AI analysis result
        /// </summary>
        public AITeamAnalysis Analysis { get; set; } = new();

        /// <summary>
        /// Whether the analysis was successful
        /// </summary>
        public bool Success { get; set; } = true;

        /// <summary>
        /// Error message if analysis failed
        /// </summary>
        public string? ErrorMessage { get; set; }

        /// <summary>
        /// Processing time in milliseconds
        /// </summary>
        public int ProcessingTimeMs { get; set; }

        /// <summary>
        /// Data source used for the analysis
        /// </summary>
        public string DataSource { get; set; } = "AI Engine";
    }
}