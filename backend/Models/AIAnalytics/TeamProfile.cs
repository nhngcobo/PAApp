namespace Backend.Models.AIAnalytics
{
    /// <summary>
    /// Represents a team's profile for AI analysis including skills, experience, and availability metrics
    /// </summary>
    public class TeamProfile
    {
        /// <summary>
        /// Total number of team members
        /// </summary>
        public int TotalMembers { get; set; }

        /// <summary>
        /// Number of members currently available for new projects
        /// </summary>
        public int AvailableMembers { get; set; }

        /// <summary>
        /// Skills distribution as percentage breakdowns by category
        /// </summary>
        public Dictionary<string, double> SkillsBreakdown { get; set; } = new();

        /// <summary>
        /// Average years of experience across the team
        /// </summary>
        public double AvgExperience { get; set; }

        /// <summary>
        /// Department distribution showing member count per department
        /// </summary>
        public Dictionary<string, int> Departments { get; set; } = new();

        /// <summary>
        /// Average project match score indicating team-project alignment
        /// </summary>
        public double AvgMatchScore { get; set; }

        /// <summary>
        /// Calculates the availability ratio (available/total)
        /// </summary>
        public double AvailabilityRatio => TotalMembers > 0 ? (double)AvailableMembers / TotalMembers : 0;

        /// <summary>
        /// Gets the skill with the highest percentage
        /// </summary>
        public KeyValuePair<string, double> DominantSkill => 
            SkillsBreakdown.Any() ? SkillsBreakdown.OrderByDescending(kv => kv.Value).First() : 
            new KeyValuePair<string, double>("General", 0);

        /// <summary>
        /// Gets the number of distinct skill categories
        /// </summary>
        public int SkillDiversity => SkillsBreakdown.Count;
    }
}