const API_BASE_URL = 'http://localhost:5214/api';

// Analytics API functions
export const analyticsApi = {
  // Get dashboard metrics
  getDashboardMetrics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Analytics/dashboard-metrics`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard metrics');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      // Return mock data for testing
      return {
        capacityForecast: {
          startDate: '2024-10-01',
          endDate: '2025-03-01',
          totalEmployees: 20,
          forecastData: [
            { date: '2024-10', availableEmployees: 6, becomingAvailable: 2, utilizationRate: 70 },
            { date: '2024-11', availableEmployees: 8, becomingAvailable: 3, utilizationRate: 60 },
            { date: '2024-12', availableEmployees: 5, becomingAvailable: 1, utilizationRate: 75 },
            { date: '2025-01', availableEmployees: 7, becomingAvailable: 4, utilizationRate: 65 },
            { date: '2025-02', availableEmployees: 9, becomingAvailable: 2, utilizationRate: 55 },
            { date: '2025-03', availableEmployees: 6, becomingAvailable: 1, utilizationRate: 70 },
          ]
        },
        skillGaps: [
          { skillName: 'React Native', currentCount: 3, recommendedCount: 6, coveragePercentage: 15, isGap: true, priority: 'Critical' },
          { skillName: 'Azure DevOps', currentCount: 2, recommendedCount: 5, coveragePercentage: 10, isGap: true, priority: 'High' },
          { skillName: 'UI/UX Design', currentCount: 1, recommendedCount: 4, coveragePercentage: 5, isGap: true, priority: 'High' },
          { skillName: 'Data Science', currentCount: 0, recommendedCount: 3, coveragePercentage: 0, isGap: true, priority: 'Medium' },
          { skillName: 'TypeScript', currentCount: 8, recommendedCount: 10, coveragePercentage: 40, isGap: false, priority: 'Low' },
        ],
        generatedAt: new Date().toISOString()
      };
    }
  },

  // Analyze team effectiveness
  analyzeTeamEffectiveness: async (employeeIds: number[], projectRequirements: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Analytics/team-effectiveness`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeIds,
          projectRequirements
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze team effectiveness');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error analyzing team effectiveness:', error);
      // Return mock data for testing
      return {
        teamId: 'mock-team-' + Date.now(),
        analysisDate: new Date().toISOString(),
        teamMembers: [],
        skillsCoverage: 85,
        experienceBalance: 78,
        teamSynergy: 92,
        overallEffectiveness: 85,
        insights: [
          "🎯 Excellent skills coverage - all critical requirements are met",
          "👥 Well-balanced team with good mix of experience levels",
          "✨ High team synergy expected - complementary skills and roles"
        ],
        risks: [
          "🎯 Single points of failure in: React Native, Azure DevOps"
        ],
        recommendations: [
          "🔍 Consider adding team member(s) with: Data Science, UI/UX Design"
        ]
      };
    }
  },

  // Get capacity forecast
  getCapacityForecast: async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await fetch(`${API_BASE_URL}/Analytics/capacity-forecast?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch capacity forecast');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching capacity forecast:', error);
      throw error;
    }
  },

  // Get skill gaps analysis
  getSkillGaps: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Analytics/skill-gaps`);
      if (!response.ok) {
        throw new Error('Failed to fetch skill gaps');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching skill gaps:', error);
      throw error;
    }
  }
};