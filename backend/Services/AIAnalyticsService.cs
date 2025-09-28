using Backend.Models.AIAnalytics;
using System.Diagnostics;

namespace Backend.Services
{
    /// <summary>
    /// Service for generating AI-powered team analysis and insights
    /// </summary>
    public class AIAnalyticsService : IAIAnalyticsService
    {
        private readonly ILogger<AIAnalyticsService> _logger;

        public AIAnalyticsService(ILogger<AIAnalyticsService> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Generates comprehensive AI analysis for a team profile
        /// </summary>
        /// <param name="request">Team analysis request containing profile and focus areas</param>
        /// <returns>Complete AI analysis with insights and recommendations</returns>
        public async Task<AITeamAnalysisResponse> AnalyzeTeamAsync(AITeamAnalysisRequest request)
        {
            var stopwatch = Stopwatch.StartNew();
            
            try
            {
                _logger.LogInformation("Starting AI team analysis for {TotalMembers} members", 
                    request.TeamProfile.TotalMembers);

                var analysis = await GenerateAIAnalysisAsync(request.TeamProfile, request.ProjectContext);
                
                stopwatch.Stop();

                return new AITeamAnalysisResponse
                {
                    Analysis = analysis,
                    Success = true,
                    ProcessingTimeMs = (int)stopwatch.ElapsedMilliseconds,
                    DataSource = "AI Analytics Engine"
                };
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                _logger.LogError(ex, "Error generating AI team analysis");

                return new AITeamAnalysisResponse
                {
                    Analysis = await GenerateFallbackAnalysisAsync(request.TeamProfile),
                    Success = false,
                    ErrorMessage = "AI analysis unavailable, using fallback analysis",
                    ProcessingTimeMs = (int)stopwatch.ElapsedMilliseconds,
                    DataSource = "Fallback Analysis Engine"
                };
            }
        }

        /// <summary>
        /// Generates AI-powered analysis using advanced algorithms
        /// In production, this would integrate with Azure OpenAI or similar service
        /// </summary>
        private async Task<AITeamAnalysis> GenerateAIAnalysisAsync(TeamProfile teamProfile, string? projectContext)
        {
            // Simulate AI processing time
            await Task.Delay(100);

            var analysis = new AITeamAnalysis();

            // Team Size Analysis
            AnalyzeTeamSize(teamProfile, analysis);

            // Availability Analysis  
            AnalyzeAvailability(teamProfile, analysis);

            // Skills Analysis
            AnalyzeSkills(teamProfile, analysis);

            // Experience Analysis
            AnalyzeExperience(teamProfile, analysis);

            // Match Score Analysis
            AnalyzeMatchScore(teamProfile, analysis);

            // Generate team dynamics assessment
            GenerateTeamDynamicsAssessment(teamProfile, analysis);

            // Generate key insights
            GenerateKeyInsights(teamProfile, analysis);

            // Ensure analysis completeness
            EnsureAnalysisCompleteness(analysis);

            _logger.LogInformation("Generated AI analysis with {StrengthCount} strengths and {RiskCount} risks", 
                analysis.TeamStrengths.Count, analysis.RiskFactors.Count);

            return analysis;
        }

        /// <summary>
        /// Analyzes team size and its implications
        /// </summary>
        private void AnalyzeTeamSize(TeamProfile profile, AITeamAnalysis analysis)
        {
            if (profile.TotalMembers < 4)
            {
                analysis.RiskFactors.Add("Small team size may limit capability breadth and create single points of failure");
                analysis.Recommendations.Add("Consider expanding team or partnering with other teams for complex projects");
                analysis.Recommendations.Add("Implement cross-training to reduce dependency risks");
            }
            else if (profile.TotalMembers > 12)
            {
                analysis.RiskFactors.Add("Large team size requires strong coordination and may slow decision-making");
                analysis.Recommendations.Add("Implement clear team structure with defined roles and communication protocols");
                analysis.Recommendations.Add("Consider breaking into smaller sub-teams for complex projects");
            }
            else
            {
                analysis.TeamStrengths.Add($"Optimal team size of {profile.TotalMembers} members enables effective collaboration without coordination overhead");
            }
        }

        /// <summary>
        /// Analyzes team availability and capacity
        /// </summary>
        private void AnalyzeAvailability(TeamProfile profile, AITeamAnalysis analysis)
        {
            var availabilityRatio = profile.AvailabilityRatio;

            if (availabilityRatio < 0.3)
            {
                analysis.RiskFactors.Add($"Low availability ({profile.AvailableMembers}/{profile.TotalMembers}) creates significant resource constraints");
                analysis.DeliveryRisk = "HIGH - Limited resource availability threatens project timelines and may require external support";
                analysis.Recommendations.Add("Prioritize project backlog and consider timeline extensions");
                analysis.Recommendations.Add("Explore contractor or temporary resource options");
            }
            else if (availabilityRatio > 0.7)
            {
                analysis.TeamStrengths.Add($"Excellent availability ({profile.AvailableMembers}/{profile.TotalMembers}) enables immediate project deployment and rapid iteration");
                analysis.DeliveryRisk = "LOW - Strong resource availability supports reliable delivery with minimal scheduling risks";
            }
            else
            {
                analysis.DeliveryRisk = "MEDIUM - Moderate availability requires careful resource planning and sprint capacity management";
                analysis.Recommendations.Add("Implement capacity planning tools and regular availability forecasting");
            }
        }

        /// <summary>
        /// Analyzes skill distribution and expertise
        /// </summary>
        private void AnalyzeSkills(TeamProfile profile, AITeamAnalysis analysis)
        {
            var dominantSkill = profile.DominantSkill;
            var skillDiversity = profile.SkillDiversity;

            if (dominantSkill.Value > 60)
            {
                analysis.TeamStrengths.Add($"Strong {dominantSkill.Key} expertise ({dominantSkill.Value:F1}%) provides deep technical capability and specialization");
                analysis.ProjectSuitability = $"Exceptional fit for {dominantSkill.Key.ToLower()}-focused projects requiring deep technical expertise and specialized knowledge";
                
                // But also note the risk
                analysis.RiskFactors.Add($"Heavy concentration in {dominantSkill.Key} may create dependency risks in other technical areas");
            }
            else
            {
                analysis.TeamStrengths.Add("Well-balanced skill distribution supports versatile full-stack development capabilities");
                analysis.ProjectSuitability = "Versatile team suitable for diverse project types and full-stack development initiatives";
            }

            if (skillDiversity < 3)
            {
                analysis.RiskFactors.Add("Limited skill diversity may create bottlenecks and single points of failure in complex projects");
                analysis.SkillGaps.Add("Cross-training in complementary technologies and methodologies");
                analysis.Recommendations.Add("Implement skill development program to broaden technical capabilities");
            }
            else if (skillDiversity > 6)
            {
                analysis.TeamStrengths.Add($"Exceptional skill diversity across {skillDiversity} areas enables comprehensive solution delivery");
            }
            else
            {
                analysis.TeamStrengths.Add($"Good skill diversity across {skillDiversity} technical areas supports varied project requirements");
            }

            // Analyze specific skill gaps
            IdentifySkillGaps(profile, analysis);
        }

        /// <summary>
        /// Identifies critical skill gaps based on industry standards
        /// </summary>
        private void IdentifySkillGaps(TeamProfile profile, AITeamAnalysis analysis)
        {
            var skills = profile.SkillsBreakdown;

            if (!skills.ContainsKey("Backend") || skills["Backend"] < 20)
                analysis.SkillGaps.Add("Backend Architecture and API Design expertise for scalable system development");

            if (!skills.ContainsKey("Frontend") || skills["Frontend"] < 20)
                analysis.SkillGaps.Add("Modern Frontend Frameworks and UI/UX Design for engaging user experiences");

            if (!skills.ContainsKey("Cloud") || skills["Cloud"] < 15)
                analysis.SkillGaps.Add("Cloud Infrastructure and DevOps Automation for scalable deployment");

            if (!skills.ContainsKey("Database") || skills["Database"] < 15)
                analysis.SkillGaps.Add("Database Design and Optimization for efficient data management");

            // Always include these common gaps
            analysis.SkillGaps.Add("Advanced Security and Compliance frameworks");
            analysis.SkillGaps.Add("Performance Optimization and Scalability Planning");
        }

        /// <summary>
        /// Analyzes team experience levels
        /// </summary>
        private void AnalyzeExperience(TeamProfile profile, AITeamAnalysis analysis)
        {
            if (profile.AvgExperience < 2)
            {
                analysis.RiskFactors.Add("Junior-heavy team composition requires additional mentorship and may extend delivery timelines");
                analysis.Recommendations.Add("Assign experienced technical lead or implement comprehensive pair programming practices");
                analysis.Recommendations.Add("Establish structured code review processes and knowledge transfer protocols");
            }
            else if (profile.AvgExperience > 8)
            {
                analysis.TeamStrengths.Add($"High experience level ({profile.AvgExperience:F1} years avg) enables complex architectural decisions and advanced problem-solving");
                analysis.RiskFactors.Add("Senior-heavy team may have higher costs and potential for over-engineering solutions");
                analysis.Recommendations.Add("Balance technical excellence with pragmatic delivery timelines");
            }
            else
            {
                analysis.TeamStrengths.Add($"Balanced experience level ({profile.AvgExperience:F1} years avg) combines innovation potential with proven stability");
            }
        }

        /// <summary>
        /// Analyzes project match score implications
        /// </summary>
        private void AnalyzeMatchScore(TeamProfile profile, AITeamAnalysis analysis)
        {
            if (profile.AvgMatchScore > 85)
            {
                analysis.TeamStrengths.Add($"Exceptional project alignment ({profile.AvgMatchScore:F1}%) indicates optimal team selection for current requirements");
            }
            else if (profile.AvgMatchScore > 70)
            {
                analysis.TeamStrengths.Add($"Strong project alignment ({profile.AvgMatchScore:F1}%) suggests good team-requirement matching");
            }
            else if (profile.AvgMatchScore < 60)
            {
                analysis.RiskFactors.Add($"Low project alignment ({profile.AvgMatchScore:F1}%) suggests significant skill-requirement mismatch");
                analysis.SkillGaps.Add("Training in project-specific technologies and domain knowledge");
                analysis.Recommendations.Add("Consider team augmentation or skill development before project start");
            }
        }

        /// <summary>
        /// Generates comprehensive team dynamics assessment
        /// </summary>
        private void GenerateTeamDynamicsAssessment(TeamProfile profile, AITeamAnalysis analysis)
        {
            var alignmentLevel = profile.AvgMatchScore > 80 ? "excellent" : 
                                profile.AvgMatchScore > 60 ? "good" : "moderate";

            var availabilityImpact = profile.AvailabilityRatio > 0.6 ? 
                "high availability supports intensive collaboration and rapid iteration cycles" :
                "moderate availability requires structured communication and efficient coordination protocols";

            var experienceImpact = profile.AvgExperience > 5 ? 
                "senior expertise enables mentorship and technical leadership" :
                "balanced experience promotes knowledge sharing and collaborative learning";

            analysis.TeamDynamics = $"Team demonstrates {alignmentLevel} project alignment with strong collaborative potential. " +
                                  $"With {experienceImpact}, the team is well-positioned for effective knowledge transfer. " +
                                  $"Current {availabilityImpact}.";
        }

        /// <summary>
        /// Generates strategic insights for decision making
        /// </summary>
        private void GenerateKeyInsights(TeamProfile profile, AITeamAnalysis analysis)
        {
            var dominantSkill = profile.DominantSkill;
            
            analysis.KeyInsights.Add($"Skill concentration in {dominantSkill.Key} ({dominantSkill.Value:F1}%) creates both competitive advantage and potential dependency risk");
            analysis.KeyInsights.Add($"Current availability of {profile.AvailabilityRatio:P0} directly impacts sprint capacity and delivery predictability");
            analysis.KeyInsights.Add($"Team experience profile of {profile.AvgExperience:F1} years suggests {(profile.AvgExperience > 5 ? "high-complexity architectural" : "standard development")} project suitability");
            
            if (profile.SkillDiversity > 5)
                analysis.KeyInsights.Add($"Exceptional skill diversity ({profile.SkillDiversity} areas) enables full-stack ownership and reduces external dependencies");
        }

        /// <summary>
        /// Ensures analysis has all required components with fallbacks
        /// </summary>
        private void EnsureAnalysisCompleteness(AITeamAnalysis analysis)
        {
            if (!analysis.Recommendations.Any())
            {
                analysis.Recommendations.Add("Monitor team utilization metrics and implement regular capacity planning");
                analysis.Recommendations.Add("Establish knowledge sharing sessions to reduce single points of failure");
                analysis.Recommendations.Add("Consider strategic skill development in emerging technologies");
            }

            if (string.IsNullOrEmpty(analysis.ProjectSuitability))
            {
                analysis.ProjectSuitability = "Team is well-suited for standard software development projects with balanced technical requirements";
            }

            if (string.IsNullOrEmpty(analysis.DeliveryRisk))
            {
                analysis.DeliveryRisk = "MEDIUM - Standard project risks apply, careful planning recommended";
            }
        }

        /// <summary>
        /// Validates a team profile for analysis
        /// </summary>
        /// <param name="profile">Team profile to validate</param>
        /// <returns>True if profile is valid for analysis</returns>
        public bool ValidateTeamProfile(TeamProfile profile)
        {
            return profile != null &&
                   profile.TotalMembers > 0 &&
                   profile.AvailableMembers >= 0 &&
                   profile.AvailableMembers <= profile.TotalMembers &&
                   profile.AvgExperience >= 0 &&
                   profile.AvgMatchScore >= 0 && profile.AvgMatchScore <= 100;
        }

        /// <summary>
        /// Gets the health status of the AI analytics service
        /// </summary>
        /// <returns>Service health information</returns>
        public async Task<ServiceHealthStatus> GetServiceHealthAsync()
        {
            await Task.Delay(10); // Simulate health check

            return new ServiceHealthStatus
            {
                IsHealthy = true,
                Status = "Operational",
                LastChecked = DateTime.UtcNow,
                AvailableFeatures = new List<string>
                {
                    "Team Analysis",
                    "Risk Assessment",
                    "Skill Gap Analysis", 
                    "Project Suitability Assessment",
                    "Team Dynamics Evaluation",
                    "Strategic Recommendations"
                },
                Version = "1.0.0"
            };
        }

        /// <summary>
        /// Generates fallback analysis when AI service is unavailable
        /// </summary>
        private async Task<AITeamAnalysis> GenerateFallbackAnalysisAsync(TeamProfile profile)
        {
            await Task.Delay(50); // Simulate processing

            var analysis = new AITeamAnalysis
            {
                ConfidenceScore = 60 // Lower confidence for fallback
            };

            // Basic analysis using rule-based logic
            analysis.TeamStrengths.Add($"Team of {profile.TotalMembers} members with {profile.AvgExperience:F1} years average experience");
            analysis.TeamStrengths.Add($"{profile.AvailableMembers} members available for immediate project assignment");

            if (profile.SkillsBreakdown.Any())
            {
                var topSkill = profile.SkillsBreakdown.OrderByDescending(kv => kv.Value).First();
                analysis.TeamStrengths.Add($"Strong {topSkill.Key} capabilities");
                analysis.ProjectSuitability = $"Suitable for {topSkill.Key.ToLower()}-focused development projects";
            }

            analysis.DeliveryRisk = profile.AvailabilityRatio > 0.5 ? "MEDIUM - Standard delivery risks" : "HIGH - Resource constraints present";
            
            analysis.TeamDynamics = "Team shows standard collaboration potential with balanced skill distribution";
            
            analysis.Recommendations.Add("Continue monitoring team capacity and skill development");
            analysis.Recommendations.Add("Implement regular team assessment and planning cycles");

            analysis.KeyInsights.Add("Fallback analysis - limited AI insights available");

            return analysis;
        }
    }
}