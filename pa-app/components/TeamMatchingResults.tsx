
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Image, TextInput, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  skills: string[];
  technologies: string[];
  department?: string;
  experienceYears?: number;
  avatarUrl?: string;
  matchScore?: number;
  // Availability tracking
  isOnProject?: boolean;
  currentProjectName?: string;
  projectEndDate?: string;
  availabilityStatus?: string;
};

// Analytics Content Component
interface AnalyticsContentProps {
  theme: any;
  employees: Employee[];
}

const AnalyticsContent: React.FC<AnalyticsContentProps> = ({ theme, employees }) => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAnalytics();
  }, [employees]);

  const generateAIInsights = async (basicData: any) => {
    try {
      // Prepare team data for AI analysis
      const teamProfile = {
        totalMembers: basicData.totalEmployees,
        availableMembers: basicData.availableEmployees,
        skillsBreakdown: basicData.skillCategories,
        avgExperience: basicData.avgExperience,
        departments: basicData.departmentCounts,
        avgMatchScore: basicData.averageMatchScore
      };

      // Call AI analytics backend endpoint
      const response = await fetch('http://localhost:5214/api/aianalytics/team-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamProfile }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const aiAnalysis = await response.json();
      return aiAnalysis;
      
    } catch (error) {
      console.error('AI Analysis failed, using fallback:', error);
      
      // Enhanced fallback analysis if backend is unavailable
      // Type-safe object access with fallbacks
      const skillCategories = basicData.skillCategories || {};
      const skillKeys = Object.keys(skillCategories);
      const skillValues = Object.values(skillCategories);
      const firstSkillKey = skillKeys[0] || 'technical';
      const firstSkillValue = (skillValues[0] as number) || 0;
      
      const mockAIResponse = {
        teamStrengths: [
          `Strong ${firstSkillKey} expertise with ${firstSkillValue}% coverage`,
          `Well-balanced experience level at ${basicData.avgExperience} years average`,
          `High team match score of ${basicData.averageMatchScore}% indicates good project alignment`,
          `${basicData.availableEmployees} members immediately available for deployment`
        ],
        riskFactors: [
          basicData.availableEmployees < 3 ? "Limited available resources may cause scheduling conflicts and delivery delays" : null,
          skillKeys.length < 4 ? "Limited skill diversity may create technical bottlenecks in complex projects" : null,
          basicData.avgExperience < 2 ? "Junior-heavy team composition requires additional mentorship and longer delivery timelines" : basicData.avgExperience > 8 ? "Senior-heavy team may have higher costs and over-engineering tendencies" : null,
          basicData.averageMatchScore < 60 ? "Low project alignment suggests significant skill-requirement mismatch" : null
        ].filter(Boolean),
        recommendations: [
          firstSkillValue < 50 ? `Consider adding more ${firstSkillKey} specialists to strengthen core capabilities` : "Maintain current technical balance while planning for skill development",
          basicData.availableEmployees < basicData.totalEmployees * 0.3 ? "Implement resource planning and capacity management due to limited availability" : "Leverage current high availability for rapid project deployment",
          "Cross-train team members in secondary skills to reduce single points of failure",
          "Implement knowledge sharing sessions and establish documentation standards",
          "Monitor team utilization metrics and establish burnout prevention measures"
        ],
        projectSuitability: `This team is exceptionally well-suited for ${firstSkillKey.toLowerCase()}-focused projects with ${basicData.averageMatchScore > 80 ? 'high complexity and enterprise-grade requirements' : 'moderate complexity and standard business applications'}. Strong match score and experience level suggest capability for ${basicData.avgExperience > 5 ? 'architectural leadership and complex problem-solving' : 'solid execution and feature development'}.`,
        skillGaps: [
          (skillCategories.Backend || 0) < 20 ? "Backend Architecture and API Design expertise" : null,
          (skillCategories.Frontend || 0) < 20 ? "Modern Frontend Frameworks and UI/UX Design" : null,
          (skillCategories.Cloud || 0) < 15 ? "Cloud Infrastructure and DevOps Automation practices" : null,
          "Advanced security and compliance frameworks",
          "Performance optimization and scalability planning"
        ].filter(Boolean),
        teamDynamics: `Team demonstrates ${basicData.averageMatchScore > 80 ? 'excellent' : basicData.averageMatchScore > 60 ? 'good' : 'moderate'} project alignment with strong collaborative potential. ${basicData.totalEmployees > 8 ? 'Large team size enables parallel workstreams but requires structured communication and coordination protocols.' : 'Optimal team size for agile development with efficient decision-making and close collaboration.'}`,
        deliveryRisk: basicData.averageMatchScore > 80 && basicData.availableEmployees > 2 ? 
          "LOW - Team is exceptionally well-aligned with strong availability and experience, supporting reliable delivery with minimal risk" : 
          basicData.averageMatchScore > 60 && basicData.availableEmployees >= 2 ? 
          "MEDIUM - Good capabilities with moderate availability require careful sprint planning and resource allocation" : 
          "HIGH - Significant skills gaps or availability constraints create substantial timeline risk requiring immediate mitigation strategies",
        keyInsights: [
          `Primary expertise in ${firstSkillKey} creates both competitive advantage and potential dependency risk`,
          `${Math.round((basicData.availableEmployees / basicData.totalEmployees) * 100)}% immediate availability directly impacts sprint capacity and delivery predictability`,
          `Team experience profile of ${basicData.avgExperience.toFixed(1)} years enables ${basicData.avgExperience > 5 ? 'complex architectural' : 'standard development'} project delivery with appropriate technical leadership`
        ]
      };

      return mockAIResponse;
    }
  };

  const generateAnalytics = async () => {
    if (!employees.length) {
      setLoading(false);
      return;
    }

    // Generate analytics from current employees
    const totalEmployees = employees.length;
    const availableEmployees = employees.filter(e => e.availabilityStatus === 'Available').length;
    const averageMatchScore = employees.reduce((sum, e) => sum + (e.matchScore || 0), 0) / totalEmployees;
    
    // Skills categorization
    const skillCategories = {
      'Frontend': ['React', 'JavaScript', 'TypeScript', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Redux', 'Next.js'],
      'Backend': ['Node.js', 'C#', 'Python', 'Java', '.NET', 'Express.js', 'Spring', 'Django', 'Flask'],
      'Database': ['SQL Server', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Database Design', 'SQL'],
      'Cloud': ['Azure', 'AWS', 'Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'Terraform'],
      'Mobile': ['React Native', 'iOS', 'Android', 'Flutter', 'Swift', 'Kotlin', 'Xamarin'],
      'Design': ['UI/UX Design', 'Figma', 'Sketch', 'Adobe', 'Prototyping', 'Design Systems'],
      'Data': ['Data Science', 'Machine Learning', 'Power BI', 'Excel', 'Analytics', 'Python', 'R'],
      'Management': ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Team Management'],
      'Other': []
    };

    // Categorize skills
    const allSkills = employees.flatMap(e => e.skills || []);
    const skillDistribution: Record<string, number> = {};
    
    // Initialize categories
    Object.keys(skillCategories).forEach(category => {
      skillDistribution[category] = 0;
    });

    // Count skills by category
    allSkills.forEach(skill => {
      let categorized = false;
      for (const [category, categorySkills] of Object.entries(skillCategories)) {
        if (category !== 'Other' && categorySkills.some(catSkill => 
          skill.toLowerCase().includes(catSkill.toLowerCase()) || 
          catSkill.toLowerCase().includes(skill.toLowerCase())
        )) {
          skillDistribution[category]++;
          categorized = true;
          break;
        }
      }
      if (!categorized) {
        skillDistribution['Other']++;
      }
    });

    // Remove categories with 0 count and calculate percentages
    const totalSkillCount = Object.values(skillDistribution).reduce((sum, count) => sum + count, 0);
    const skillsPieData = Object.entries(skillDistribution)
      .filter(([, count]) => count > 0)
      .map(([category, count]) => ({
        name: category,
        count,
        percentage: Math.round((count / totalSkillCount) * 100),
        color: getSkillCategoryColor(category)
      }))
      .sort((a, b) => b.count - a.count);
    
    // Individual skills analysis
    const skillCounts = allSkills.reduce((acc, skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topSkills = Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Department analysis
    const departmentCounts = employees.reduce((acc, e) => {
      const dept = e.department || 'Unknown';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Experience analysis
    const avgExperience = employees.reduce((sum, e) => sum + (e.experienceYears || 0), 0) / totalEmployees;
    
    const basicAnalytics = {
      totalEmployees,
      availableEmployees,
      averageMatchScore: Math.round(averageMatchScore),
      topSkills,
      skillsPieData,
      skillCategories: skillDistribution,
      departmentCounts,
      avgExperience: Math.round(avgExperience * 10) / 10,
      utilizationRate: Math.round((1 - availableEmployees / totalEmployees) * 100)
    };

    // Call AI insights with the basic analytics
    const aiInsights = await generateAIInsights(basicAnalytics);
    
    setAnalyticsData(basicAnalytics);
    setAiInsights(aiInsights);
    
    setLoading(false);
  };

  // Helper function to assign colors to skill categories
  const getSkillCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Frontend': '#61DAFB',     // React blue
      'Backend': '#68A063',      // Node green  
      'Database': '#F29111',     // Orange
      'Cloud': '#FF9900',        // AWS orange
      'Mobile': '#4FC3F7',       // Light blue
      'Design': '#E91E63',       // Pink
      'Data': '#9C27B0',         // Purple
      'Management': '#FF5722',   // Deep orange
      'Other': '#757575'         // Gray
    };
    return colors[category] || '#757575';
  };

  // Better Pie Chart Component using circular segments
  const SimplePieChart = ({ data, size = 160 }: { data: any[], size?: number }) => {
    if (!data || data.length === 0) return null;

    const radius = size / 2;
    const strokeWidth = 20;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    // Calculate cumulative percentages for segments
    let cumulativePercentage = 0;

    return (
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        {/* Circular Progress Chart */}
        <View style={{ 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: '#2A2F3A',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Render segments as overlapping circles */}
          {data.map((item, index) => {
            const segmentPercentage = item.percentage;
            const rotation = (cumulativePercentage / 100) * 360;
            cumulativePercentage += segmentPercentage;

            return (
              <View
                key={index}
                style={{
                  position: 'absolute',
                  width: size - 40,
                  height: size - 40,
                  borderRadius: (size - 40) / 2,
                  borderWidth: strokeWidth / 2,
                  borderColor: item.color,
                  borderTopColor: segmentPercentage > 25 ? item.color : 'transparent',
                  borderRightColor: segmentPercentage > 25 ? item.color : 'transparent',
                  borderBottomColor: segmentPercentage > 50 ? item.color : 'transparent',
                  borderLeftColor: segmentPercentage > 75 ? item.color : 'transparent',
                  transform: [{ rotate: `${rotation}deg` }],
                  opacity: 0.8
                }}
              />
            );
          })}

          {/* Center content */}
          <View style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: 'bold', fontFamily: 'Arial Narrow, Arial, sans-serif' }}>Skills</Text>
            <Text style={{ color: theme.secondaryText, fontSize: 10, fontFamily: 'Arial Narrow, Arial, sans-serif' }}>Distribution</Text>
          </View>
        </View>

        {/* Simple circular indicators */}
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          marginTop: 16, 
          marginBottom: 8 
        }}>
          {data.slice(0, 4).map((item, index) => (
            <View key={index} style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              margin: 4,
              backgroundColor: 'rgba(255,255,255,0.05)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12
            }}>
              <View style={{
                width: 8,
                height: 8,
                backgroundColor: item.color,
                borderRadius: 4,
                marginRight: 6
              }} />
              <Text style={{ color: theme.text, fontSize: 11, fontWeight: '500', fontFamily: 'Arial Narrow, Arial, sans-serif' }}>
                {item.name} {item.percentage}%
              </Text>
            </View>
          ))}
        </View>

        {/* Detailed Legend */}
        <View style={{ marginTop: 8, width: '100%' }}>
          {data.map((item, index) => (
            <View key={index} style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 6,
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255,255,255,0.02)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 6
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  borderRadius: 2,
                  marginRight: 10
                }} />
                <Text style={{ color: theme.text, fontSize: 13, fontWeight: '500', fontFamily: 'Arial Narrow, Arial, sans-serif' }}>{item.name}</Text>
              </View>
              <Text style={{ color: theme.accent, fontSize: 13, fontWeight: '600', fontFamily: 'Arial Narrow, Arial, sans-serif' }}>
                {item.percentage}% ({item.count})
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: theme.text, fontSize: 16 }}>Generating analytics...</Text>
      </View>
    );
  }

  if (!analyticsData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: theme.text, fontSize: 16 }}>No data available for analytics</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      {/* Key Metrics */}
      <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Team Analytics Overview
      </Text>
      
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <View style={[styles.analyticsCard, { backgroundColor: theme.card, marginRight: 8 }]}>
          <Text style={{ color: theme.accent, fontSize: 24, fontWeight: 'bold' }}>
            {analyticsData.totalEmployees}
          </Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12 }}>Total Members</Text>
        </View>
        
        <View style={[styles.analyticsCard, { backgroundColor: theme.card, marginRight: 8 }]}>
          <Text style={{ color: '#48BB78', fontSize: 24, fontWeight: 'bold' }}>
            {analyticsData.availableEmployees}
          </Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12 }}>Available</Text>
        </View>
        
        <View style={[styles.analyticsCard, { backgroundColor: theme.card }]}>
          <Text style={{ color: '#F6AD55', fontSize: 24, fontWeight: 'bold' }}>
            {analyticsData.averageMatchScore}%
          </Text>
          <Text style={{ color: theme.secondaryText, fontSize: 12 }}>Avg Match</Text>
        </View>
      </View>

      {/* Skills Distribution Pie Chart */}
      <View style={[styles.analyticsSection, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
          🎯 Skills Distribution
        </Text>
        {analyticsData.skillsPieData && analyticsData.skillsPieData.length > 0 ? (
          <SimplePieChart data={analyticsData.skillsPieData} size={160} />
        ) : (
          <Text style={{ color: theme.secondaryText, textAlign: 'center', padding: 20 }}>
            No skills data available
          </Text>
        )}
      </View>

      {/* Top Individual Skills */}
      <View style={[styles.analyticsSection, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
          🏆 Most Common Skills
        </Text>
        {analyticsData.topSkills.map(([skill, count]: [string, number], index: number) => (
          <View key={skill} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: theme.text }}>{skill}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: Math.max(20, count * 20),
                height: 6,
                backgroundColor: theme.accent,
                borderRadius: 3,
                marginRight: 8
              }} />
              <Text style={{ color: theme.secondaryText, fontSize: 12 }}>{count}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Department Distribution */}
      <View style={[styles.analyticsSection, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
          🏢 Department Breakdown
        </Text>
        {Object.entries(analyticsData.departmentCounts).map(([dept, count]) => (
          <View key={dept} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ color: theme.text }}>{dept}</Text>
            <Text style={{ color: theme.accent, fontWeight: '600' }}>{String(count)}</Text>
          </View>
        ))}
      </View>

      {/* Team Insights */}
      <View style={[styles.analyticsSection, { backgroundColor: theme.card }]}>
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
          💡 Team Insights
        </Text>
        
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: theme.text, marginBottom: 4 }}>Average Experience</Text>
          <Text style={{ color: theme.accent, fontSize: 16, fontWeight: '600' }}>
            {analyticsData.avgExperience} years
          </Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: theme.text, marginBottom: 4 }}>Team Utilization</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              flex: 1,
              height: 8,
              backgroundColor: '#353945',
              borderRadius: 4,
              marginRight: 8
            }}>
              <View style={{
                width: `${analyticsData.utilizationRate}%`,
                height: '100%',
                backgroundColor: analyticsData.utilizationRate > 80 ? '#E53E3E' : analyticsData.utilizationRate > 60 ? '#F6AD55' : '#48BB78',
                borderRadius: 4
              }} />
            </View>
            <Text style={{ color: theme.text, fontWeight: '600' }}>
              {analyticsData.utilizationRate}%
            </Text>
          </View>
        </View>

        <View style={{ 
          backgroundColor: 'rgba(72, 187, 120, 0.1)', 
          padding: 12, 
          borderRadius: 8,
          borderLeftWidth: 3,
          borderLeftColor: theme.accent
        }}>
          <Text style={{ color: theme.text, fontSize: 14 }}>
            💡 This team has a strong skill coverage with {analyticsData.averageMatchScore}% average match score. 
            {analyticsData.utilizationRate > 70 
              ? " High utilization suggests good resource allocation." 
              : " Lower utilization indicates availability for additional projects."}
          </Text>
        </View>
      </View>

      {/* AI-Powered Insights Section */}
      {aiInsights && (
        <>
          <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 16, marginTop: 8 }}>
            🤖 AI Strategic Analysis
          </Text>

          {/* Team Strengths */}
          <View style={[styles.analyticsSection, { backgroundColor: theme.card }]}>
            <Text style={{ color: '#48BB78', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
              💪 Team Strengths
            </Text>
            {aiInsights.teamStrengths.map((strength: string, index: number) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <Text style={{ color: '#48BB78', marginRight: 8 }}>✓</Text>
                <Text style={{ color: theme.text, flex: 1 }}>{strength}</Text>
              </View>
            ))}
          </View>

          {/* Risk Assessment */}
          <View style={[styles.analyticsSection, { backgroundColor: theme.card }]}>
            <Text style={{ color: '#F6AD55', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
              ⚠️ Risk Assessment ({aiInsights.deliveryRisk.split(' - ')[0]})
            </Text>
            {aiInsights.riskFactors.map((risk: string, index: number) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <Text style={{ color: '#F6AD55', marginRight: 8 }}>⚡</Text>
                <Text style={{ color: theme.text, flex: 1 }}>{risk}</Text>
              </View>
            ))}
            <View style={{ 
              backgroundColor: 'rgba(246, 173, 85, 0.1)', 
              padding: 10, 
              borderRadius: 6,
              marginTop: 8
            }}>
              <Text style={{ color: theme.text, fontSize: 13 }}>
                {aiInsights.deliveryRisk.split(' - ')[1] || aiInsights.deliveryRisk}
              </Text>
            </View>
          </View>

          {/* Strategic Recommendations */}
          <View style={[styles.analyticsSection, { backgroundColor: theme.card }]}>
            <Text style={{ color: '#6B73FF', fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
              🎯 Strategic Recommendations
            </Text>
            {aiInsights.recommendations.map((rec: string, index: number) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
                <Text style={{ color: '#6B73FF', marginRight: 8 }}>{index + 1}.</Text>
                <Text style={{ color: theme.text, flex: 1 }}>{rec}</Text>
              </View>
            ))}
          </View>

          {/* Project Suitability */}
          <View style={[styles.analyticsSection, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
              🎪 Project Suitability Analysis
            </Text>
            <Text style={{ color: theme.text, lineHeight: 22 }}>
              {aiInsights.projectSuitability}
            </Text>
            
            {aiInsights.skillGaps.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: '#E53E3E', fontWeight: '600', marginBottom: 8 }}>
                  Critical Skill Gaps:
                </Text>
                {aiInsights.skillGaps.map((gap: string, index: number) => (
                  <Text key={index} style={{ color: '#E53E3E', marginLeft: 16, marginBottom: 4 }}>
                    • {gap}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {/* Team Dynamics */}
          <View style={[styles.analyticsSection, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
              🤝 Team Dynamics Assessment
            </Text>
            <Text style={{ color: theme.text, lineHeight: 22 }}>
              {aiInsights.teamDynamics}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};


const TeamMatchingResults: React.FC = () => {
  // Pulse animation for skeleton loading
  const pulseAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    
    pulseAnimation.start();
    
    return () => pulseAnimation.stop();
  }, [pulseAnim]);

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  // Static theme to match the app design
  const theme = {
    background: '#20232A',
    text: '#FFFFFF',
    primary: '#48BB78',
    card: '#262B36',
    projectCard: '#23272F',
    button: '#48BB78',
    buttonText: '#FFFFFF',
    accent: '#48BB78',
    gridDot: '#353945',
    metaText: '#A0ADB8',
    secondaryText: '#A0ADB8',
    badgeHigh: '#E53E3E',
    badgeMedium: '#48BB78',
    badgeLow: '#48BB78',
    cardBorder: '#353945',
  };
  const navigation = useNavigation();
  const route = useRoute<any>();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minMatchPercentage, setMinMatchPercentage] = useState(0);
  const [maxMatchPercentage, setMaxMatchPercentage] = useState(100);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true); // Default to collapsed
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all'); // 'all', 'available', 'availableSoon', 'onProject'
  
  // New state for tab switching
  const [activeTab, setActiveTab] = useState<'results' | 'analytics'>('results');
  
  // Search functionality with debouncing
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);
  
  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);
  
  // Search suggestions based on available data
  const getSearchSuggestions = () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    const query = searchQuery.toLowerCase();
    const suggestions: string[] = [];
    
    // Add matching names, roles, departments
    employees.forEach(emp => {
      if (emp.name?.toLowerCase().includes(query) && !suggestions.includes(emp.name)) {
        suggestions.push(emp.name);
      }
      if (emp.role?.toLowerCase().includes(query) && !suggestions.includes(emp.role)) {
        suggestions.push(emp.role);
      }
      if (emp.department?.toLowerCase().includes(query) && !suggestions.includes(emp.department)) {
        suggestions.push(emp.department);
      }
      // Add matching skills and technologies
      emp.skills?.forEach(skill => {
        if (skill.toLowerCase().includes(query) && !suggestions.includes(skill)) {
          suggestions.push(skill);
        }
      });
      emp.technologies?.forEach(tech => {
        if (tech.toLowerCase().includes(query) && !suggestions.includes(tech)) {
          suggestions.push(tech);
        }
      });
    });
    
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };
  
  const searchSuggestions = getSearchSuggestions();

  const initialRequirements = route.params?.requirements || {
    skills: [],
    technologies: []
  };
  const [requirements, setRequirements] = useState(initialRequirements);

  // Check if any filters are applied
  const hasActiveFilters = 
    (requirements.skills && requirements.skills.length > 0) ||
    (requirements.technologies && requirements.technologies.length > 0) ||
    minMatchPercentage > 0 ||
    maxMatchPercentage < 100 ||
    availabilityFilter !== 'all' ||
    debouncedSearchQuery.trim().length > 0;

  // Only fetch once on mount, or when requirements change
  const fetchedRef = useRef(false);
  const fetchMatches = async (reqs = requirements) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Sending match request with requirements:', reqs);
      
      // 1. Get matched employees from backend (array of { employee, matchScore })
      const apiUrl = Constants.expoConfig?.extra?.API_URL || Constants.manifest?.extra?.API_URL || 'http://localhost:5214';
      console.log('API URL:', apiUrl);
      
      const res = await fetch(`${apiUrl}/api/employees/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqs)
      });
      
      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.log('Error response:', errorText);
        throw new Error(`Failed to fetch matches: ${res.status} - ${errorText}`);
      }
      
      const matchResults: any[] = await res.json();
      console.log('Match results from backend:', matchResults);
      console.log('Number of results:', matchResults.length);
      
      if (!matchResults.length) {
        console.log('No match results returned from backend');
        setEmployees([]);
        setLoading(false);
        return;
      }
      
      // 2. Extract employee objects and parse skills/technologies as arrays
      const matchedEmployees = matchResults.map((match: any) => {
        const emp = match.employee || {};
        console.log('Processing employee:', emp.name, 'Match score:', match.matchScore);
        
        // Calculate availability status based on project data
        let availabilityStatus = 'Unknown';
        if (!emp.isOnProject) {
          availabilityStatus = 'Available';
        } else if (emp.projectEndDate) {
          const endDate = new Date(emp.projectEndDate);
          const now = new Date();
          const twoMonthsFromNow = new Date();
          twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
          
          if (endDate <= twoMonthsFromNow) {
            availabilityStatus = 'Available Soon';
          } else {
            availabilityStatus = 'On Project';
          }
        } else {
          availabilityStatus = 'On Project';
        }
        
        return {
          ...emp,
          skills: typeof emp.skills === 'string' ? emp.skills.split(',').map((s: string) => s.trim()) : emp.skills,
          technologies: typeof emp.technologies === 'string' ? emp.technologies.split(',').map((t: string) => t.trim()) : emp.technologies,
          matchScore: match.matchScore,
          availabilityStatus: availabilityStatus
        };
      });
      
      console.log('Final processed employees:', matchedEmployees);
      setEmployees(matchedEmployees);
    } catch (err: any) {
      console.error('Error in fetchMatches:', err);
      setError(err.message || 'Error fetching matches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      (requirements.skills && requirements.skills.length > 0) ||
      (requirements.technologies && requirements.technologies.length > 0)
    ) {
      fetchMatches(requirements);
    } else {
      setEmployees([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requirements]);

  // Remove skill/tech from filter
  const handleRemoveSkill = (skill: string) => {
    const newSkills = requirements.skills.filter((s: string) => s !== skill);
    setRequirements({ ...requirements, skills: newSkills });
  };
  const handleRemoveTech = (tech: string) => {
    const newTechs = requirements.technologies.filter((t: string) => t !== tech);
    setRequirements({ ...requirements, technologies: newTechs });
  };
  
  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setMinMatchPercentage(0);
    setMaxMatchPercentage(100);
    setAvailabilityFilter('all');
    setRequirements({ skills: [], technologies: [] });
  };

  // Filter employees based on match percentage range, availability, and search query
  const filteredEmployees = employees.filter(emp => {
    const matchPercentage = (emp.matchScore || 0) * 100;
    const matchesPercentage = matchPercentage >= minMatchPercentage && matchPercentage <= maxMatchPercentage;
    
    // Apply availability filter
    let matchesAvailability = true;
    if (availabilityFilter === 'available') {
      matchesAvailability = emp.availabilityStatus === 'Available';
    } else if (availabilityFilter === 'availableSoon') {
      matchesAvailability = emp.availabilityStatus === 'Available Soon';
    } else if (availabilityFilter === 'onProject') {
      matchesAvailability = emp.availabilityStatus === 'On Project';
    }
    
    // Apply search filter
    let matchesSearch = true;
    if (debouncedSearchQuery.trim().length > 0) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      const name = (emp.name || '').toLowerCase();
      const role = (emp.role || '').toLowerCase();
      const department = (emp.department || '').toLowerCase();
      const skills = (emp.skills || []).map((s: string) => s.toLowerCase()).join(' ');
      const technologies = (emp.technologies || []).map((t: string) => t.toLowerCase()).join(' ');
      
      matchesSearch = name.includes(query) || 
                     role.includes(query) || 
                     department.includes(query) ||
                     skills.includes(query) ||
                     technologies.includes(query);
    }
    
    return matchesPercentage && matchesAvailability && matchesSearch;
  });

  // Compute only matched skills/techs (those present in at least one filtered employee)
  const matchedSkills = requirements.skills.filter((skill: string) =>
    filteredEmployees.some(emp => (emp.skills || []).map((s: string) => s.toLowerCase()).includes(skill.toLowerCase()))
  );
  const matchedTechs = requirements.technologies.filter((tech: string) =>
    filteredEmployees.some(emp => (emp.technologies || []).map((t: string) => t.toLowerCase()).includes(tech.toLowerCase()))
  );

  const renderEmployee = ({ item }: { item: Employee & { matchScore?: number } }) => {
    const apiUrl = Constants.expoConfig?.extra?.API_URL || Constants.manifest?.extra?.API_URL || 'http://localhost:5214';
    
    // Determine match level and colors
    const matchPercentage = item.matchScore !== undefined ? Math.round(item.matchScore * 100) : 0;
    let matchLevel = 'Low';
    let matchColor = '#EF4444'; // Red for low
    
    if (matchPercentage >= 70) {
      matchLevel = 'Excellent';
      matchColor = '#22C55E'; // Green for high
    } else if (matchPercentage >= 40) {
      matchLevel = 'Good';
      matchColor = '#F59E0B'; // Orange for medium
    }
    
    return (
      <View style={[styles.modernCard, { backgroundColor: theme.projectCard }]}> 
        <View style={styles.cardHeader}>
          {/* Avatar and Basic Info */}
          <View style={styles.avatarSection}>
            <View style={[styles.modernAvatar, { backgroundColor: '#e0e0e0' }]}>
              {item.avatarUrl ? (
                <Image 
                  source={{ uri: `${apiUrl}${item.avatarUrl}` }} 
                  style={styles.modernAvatarImage}
                  defaultSource={require('../assets/images/icon.png')}
                />
              ) : (
                <Ionicons name="person" size={32} color="#666" />
              )}
            </View>
          </View>
          
          {/* Name and Details */}
          <View style={styles.headerContent}>
            <Text style={[styles.modernName, { color: theme.text }]}>{item.name}</Text>
            <View style={styles.modernRoleBadge}>
              <Text style={[styles.modernRoleText, { color: theme.secondaryText }]}>{item.department || item.role}</Text>
            </View>
            <Text style={[styles.yearsText, { color: theme.secondaryText, marginBottom: 8 }]}>({item.experienceYears || 0} years experience)</Text>
            <View style={styles.availabilityRow}>
              {(() => {
                const status = item.availabilityStatus || 'Unknown';
                let dotColor = '#94A3B8'; // Default gray
                let textColor = theme.secondaryText;
                
                if (status === 'Available') {
                  dotColor = '#22C55E'; // Green
                  textColor = '#22C55E';
                } else if (status === 'Available Soon') {
                  dotColor = '#F59E0B'; // Orange
                  textColor = '#F59E0B';
                } else if (status === 'On Project') {
                  dotColor = '#EF4444'; // Red
                  textColor = '#EF4444';
                }
                
                return (
                  <>
                    <View style={[styles.availabilityDotModern, { backgroundColor: dotColor }]} />
                    <Text style={[styles.availabilityTextModern, { color: textColor }]}>{status}</Text>
                    {item.currentProjectName && status !== 'Available' && (
                      <Text style={[styles.projectInfoText, { color: theme.secondaryText }]}> • {item.currentProjectName}</Text>
                    )}
                  </>
                );
              })()}
            </View>
          </View>
          
          {/* Status Indicator */}
          <View style={styles.statusIndicatorModern}>
            <View style={[styles.statusDotModern, { backgroundColor: matchColor }]} />
          </View>
        </View>
        
        {/* Skills Section */}
        <View style={styles.sectionSpacing}>
          <Text style={[styles.modernSectionTitle, { color: theme.text }]}>Skills</Text>
          <View style={styles.modernChipRow}>
            {item.skills?.map((skill: string, idx: number) => (
              <View key={skill + idx} style={[styles.modernSkillChip, { backgroundColor: theme.background, borderColor: theme.cardBorder }]}> 
                <Text style={[styles.modernChipText, { color: theme.text }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Technologies Section */}
        <View style={styles.sectionSpacing}>
          <Text style={[styles.modernSectionTitle, { color: theme.text }]}>Technologies</Text>
          <View style={styles.modernChipRow}>
            {item.technologies?.map((tech: string, idx: number) => (
              <View key={tech + idx} style={styles.modernTechChip}> 
                <Text style={styles.modernTechText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Match Score and Action */}
        <View style={styles.modernFooter}>
          <View style={styles.matchSection}>
            <View style={[styles.circularProgress, { borderColor: matchColor }]}>
              <Text style={[styles.percentageText, { color: matchColor }]}>{matchPercentage}%</Text>
            </View>
            <View style={styles.matchTextSection}>
              <Text style={[styles.matchLabel, { color: theme.secondaryText }]}>Match</Text>
              <Text style={[styles.matchPercentage, { color: matchColor }]}>{matchPercentage}% {matchLevel}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const { height } = Dimensions.get('window');
  return (

    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', marginBottom: 32, height: 32 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0, zIndex: 2, paddingLeft: 8 }}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.headerTitle, { color: theme.text, marginBottom: 0, textAlign: 'center' }]}>Team Matching Results</Text>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'results' && styles.activeTab]} 
          onPress={() => setActiveTab('results')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'results' ? theme.buttonText : theme.secondaryText} 
            style={{ marginRight: 6 }}
          />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'results' ? theme.buttonText : theme.secondaryText }
          ]}>
            Team Results
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'analytics' && styles.activeTab]} 
          onPress={() => setActiveTab('analytics')}
        >
          <Ionicons 
            name="analytics" 
            size={20} 
            color={activeTab === 'analytics' ? theme.buttonText : theme.secondaryText} 
            style={{ marginRight: 6 }}
          />
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'analytics' ? theme.buttonText : theme.secondaryText }
          ]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'results' ? (
        // Original team results content
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { 
          borderColor: searchFocused ? theme.accent : theme.cardBorder,
          backgroundColor: theme.card 
        }]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={searchQuery.length > 0 ? theme.accent : theme.secondaryText} 
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by name, role, skills, or department..."
            placeholderTextColor={theme.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.searchClearButton}
            >
              <Ionicons name="close-circle" size={18} color={theme.secondaryText} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Search Suggestions */}
        {searchFocused && searchQuery.length >= 2 && (
          <View style={[styles.suggestionsContainer, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {searchSuggestions.length > 0 ? (
              searchSuggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSearchQuery(suggestion);
                    setSearchFocused(false);
                  }}
                >
                  <Ionicons name="search" size={16} color={theme.secondaryText} style={{ marginRight: 8 }} />
                  <Text style={[styles.suggestionText, { color: theme.text }]}>{suggestion}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.suggestionItem}>
                <Animated.View style={[styles.loadingPulse, styles.suggestionSkeleton, { opacity: pulseOpacity }]} />
                <Animated.View style={[styles.loadingPulse, styles.suggestionSkeleton, { opacity: pulseOpacity, width: '60%' }]} />
              </View>
            )}
          </View>
        )}
        
        {/* Search Results Count */}
        {searchQuery.trim().length > 0 && (
          <View style={styles.searchResultsContainer}>
            <Text style={[styles.searchResultsText, { color: theme.secondaryText }]}>
              {filteredEmployees.length} result{filteredEmployees.length !== 1 ? 's' : ''} for "{searchQuery}"
            </Text>
            {filteredEmployees.length === 0 && (
              <Text style={[styles.noResultsText, { color: theme.secondaryText }]}>
                Try adjusting your search terms or filters
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Collapsible Percentage Range Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterHeader}
          onPress={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
        >
          <View style={styles.filterIconContainer}>
            <View style={[styles.filterLine, { backgroundColor: theme.accent }]} />
            <View style={[styles.filterLine, { backgroundColor: theme.accent }]} />
            <View style={[styles.filterLine, { backgroundColor: theme.accent }]} />
          </View>
          <Text style={[styles.filterTitle, { color: theme.text }]}>
            Filters
          </Text>
          
          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <TouchableOpacity 
              onPress={handleClearAllFilters}
              style={[styles.clearAllButton, { backgroundColor: theme.accent + '20' }]}
            >
              <Text style={[styles.clearAllText, { color: theme.accent }]}>Clear All</Text>
            </TouchableOpacity>
          )}
          
          {/* Modern Filter Indicator */}
          {hasActiveFilters && isFiltersCollapsed && (
            <View style={styles.filterIndicatorContainer}>
              <View style={[styles.filterIndicatorDot, { backgroundColor: theme.accent }]} />
              <Text style={[styles.filterIndicatorText, { color: theme.accent }]}>
                {[
                  requirements.skills?.length || 0,
                  requirements.technologies?.length || 0,
                  (minMatchPercentage > 0 || maxMatchPercentage < 100) ? 1 : 0,
                  debouncedSearchQuery.trim().length > 0 ? 1 : 0,
                  availabilityFilter !== 'all' ? 1 : 0
                ].reduce((a, b) => a + b, 0)} active
              </Text>
            </View>
          )}
        </TouchableOpacity>
        
        {!isFiltersCollapsed && (
          <View>
            {/* Skills Section */}
            {requirements.skills && requirements.skills.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={[styles.filterSectionTitle, { color: theme.secondaryText }]}>Skills</Text>
                <View style={styles.chipRow}>
                  {requirements.skills.map((skill: string, idx: number) => (
                    <View key={skill + idx} style={[styles.chip, { backgroundColor: theme.background, borderColor: theme.accent }]}>
                      <Text style={{ color: theme.text, fontSize: 12 }}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Technologies Section */}
            {requirements.technologies && requirements.technologies.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text style={[styles.filterSectionTitle, { color: theme.secondaryText }]}>Technologies</Text>
                <View style={styles.chipRow}>
                  {requirements.technologies.map((tech: string, idx: number) => (
                    <View key={tech + idx} style={[styles.chip, { backgroundColor: '#f3e6fa', borderColor: '#d1b3ff' }]}>
                      <Text style={{ color: '#a259ff', fontSize: 12 }}>{tech}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            
            {/* Match Percentage Filter */}
            <View>
              <Text style={[styles.filterSectionTitle, { color: theme.secondaryText }]}>Match Percentage Range</Text>
              <View style={styles.rangeContainer}>
                <View style={styles.rangeInputContainer}>
                  <Text style={[styles.rangeLabel, { color: theme.secondaryText }]}>Min</Text>
                  <TouchableOpacity 
                    style={styles.rangeInput}
                    onPress={() => {
                      const newMin = minMatchPercentage >= 10 ? minMatchPercentage - 10 : 0;
                      if (newMin <= maxMatchPercentage) {
                        setMinMatchPercentage(newMin);
                      }
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 16 }}>{minMatchPercentage}%</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rangeSeparator}>
                  <Text style={[styles.rangeSeparatorText, { color: theme.secondaryText }]}>to</Text>
                </View>
                <View style={styles.rangeInputContainer}>
                  <Text style={[styles.rangeLabel, { color: theme.secondaryText }]}>Max</Text>
                  <TouchableOpacity 
                    style={styles.rangeInput}
                    onPress={() => {
                      const newMax = maxMatchPercentage <= 90 ? maxMatchPercentage + 10 : 100;
                      if (newMax >= minMatchPercentage) {
                        setMaxMatchPercentage(newMax);
                      }
                    }}
                  >
                    <Text style={{ color: theme.text, fontSize: 16 }}>{maxMatchPercentage}%</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.rangeButtonsContainer}>
                <TouchableOpacity 
                  style={[styles.rangeButton, { backgroundColor: theme.card }]}
                  onPress={() => { setMinMatchPercentage(0); setMaxMatchPercentage(100); }}
                >
                  <Text style={{ color: theme.text, fontSize: 12 }}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.rangeButton, { backgroundColor: theme.card }]}
                  onPress={() => { setMinMatchPercentage(70); setMaxMatchPercentage(100); }}
                >
                  <Text style={{ color: theme.text, fontSize: 12 }}>High (70%+)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.rangeButton, { backgroundColor: theme.card }]}
                  onPress={() => { setMinMatchPercentage(40); setMaxMatchPercentage(69); }}
                >
                  <Text style={{ color: theme.text, fontSize: 12 }}>Medium (40-69%)</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.rangeButton, { backgroundColor: theme.card }]}
                  onPress={() => { setMinMatchPercentage(0); setMaxMatchPercentage(39); }}
                >
                  <Text style={{ color: theme.text, fontSize: 12 }}>Low (0-39%)</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Availability Status Filter */}
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.filterSectionTitle, { color: theme.secondaryText }]}>Availability Status</Text>
              <View style={styles.availabilityFilterContainer}>
                {[
                  { key: 'all', label: 'All', color: '#6B7280' },
                  { key: 'available', label: 'Available', color: '#22C55E' },
                  { key: 'availableSoon', label: 'Available Soon', color: '#F59E0B' },
                  { key: 'onProject', label: 'On Project', color: '#EF4444' }
                ].map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    style={[
                      styles.availabilityFilterButton,
                      {
                        backgroundColor: availabilityFilter === filter.key ? filter.color + '20' : 'transparent',
                        borderColor: availabilityFilter === filter.key ? filter.color : theme.cardBorder,
                      }
                    ]}
                    onPress={() => setAvailabilityFilter(filter.key)}
                  >
                    <View style={[
                      styles.availabilityFilterDot,
                      { backgroundColor: filter.color }
                    ]} />
                    <Text style={[
                      styles.availabilityFilterText,
                      {
                        color: availabilityFilter === filter.key ? filter.color : theme.secondaryText,
                        fontWeight: availabilityFilter === filter.key ? '600' : '400'
                      }
                    ]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Matching Results Summary */}
      <View style={{ marginHorizontal: 12, marginBottom: 16 }}>
        {/* Removed search icon and 'Matching Results' text as requested */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
          <View style={styles.summaryCard}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Ionicons name="people" size={22} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.summaryCount}>{filteredEmployees.length}</Text>
            </View>
            <Text style={styles.summaryLabel}>Total Matches</Text>
          </View>
          <View style={styles.summaryCard}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Ionicons name="checkmark-circle" size={22} color="#48BB78" style={{ marginRight: 6 }} />
              <Text style={styles.summaryCount}>{filteredEmployees.filter(emp => emp.availabilityStatus === 'Available').length}</Text>
            </View>
            <Text style={styles.summaryLabel}>Available</Text>
          </View>
          <View style={styles.summaryCard}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Ionicons name="person-add" size={22} color="#A0ADB8" style={{ marginRight: 6 }} />
              <Text style={styles.summaryCount}>0</Text>
            </View>
            <Text style={styles.summaryLabel}>Selected</Text>
          </View>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          {/* Loading Header */}
          <View style={styles.loadingHeader}>
            <Animated.View style={[styles.loadingPulse, styles.loadingIcon, { opacity: pulseOpacity }]} />
            <View style={styles.loadingTextContainer}>
              <Animated.View style={[styles.loadingPulse, styles.loadingTitle, { opacity: pulseOpacity }]} />
              <Animated.View style={[styles.loadingPulse, styles.loadingSubtitle, { opacity: pulseOpacity }]} />
            </View>
          </View>
          
          {/* Skeleton Employee Cards */}
          {[1, 2, 3].map((index) => (
            <View key={index} style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
              {/* Card Header */}
              <View style={styles.skeletonHeader}>
                <Animated.View style={[styles.loadingPulse, styles.skeletonAvatar, { opacity: pulseOpacity }]} />
                <View style={styles.skeletonHeaderContent}>
                  <Animated.View style={[styles.loadingPulse, styles.skeletonName, { opacity: pulseOpacity }]} />
                  <Animated.View style={[styles.loadingPulse, styles.skeletonRole, { opacity: pulseOpacity }]} />
                  <Animated.View style={[styles.loadingPulse, styles.skeletonExperience, { opacity: pulseOpacity }]} />
                </View>
              </View>
              
              {/* Skills Section */}
              <View style={styles.skeletonSkills}>
                {[1, 2, 3, 4].map((skillIndex) => (
                  <Animated.View key={skillIndex} style={[styles.loadingPulse, styles.skeletonSkill, { opacity: pulseOpacity }]} />
                ))}
              </View>
              
              {/* Footer */}
              <View style={styles.skeletonFooter}>
                <Animated.View style={[styles.loadingPulse, styles.skeletonMatch, { opacity: pulseOpacity }]} />
                <Animated.View style={[styles.loadingPulse, styles.skeletonButton, { opacity: pulseOpacity }]} />
              </View>
            </View>
          ))}
          
          {/* Loading Progress Indicator */}
          <View style={styles.loadingProgress}>
            <View style={[styles.loadingProgressBar, { backgroundColor: theme.cardBorder }]}>
              <Animated.View style={[styles.progressFill, { backgroundColor: theme.accent, opacity: pulseOpacity }]} />
            </View>
            <Text style={[styles.loadingText, { color: theme.accent }]}>
              🔍 Analyzing skills and matching candidates...
            </Text>
          </View>
        </View>
      )}
      {!loading && (
  <View style={{ maxHeight: 600, minHeight: 60 }}>
          {employees.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 32, backgroundColor: '#18181b', borderRadius: 18, marginHorizontal: 8, marginTop: 8 }}>
              <Ionicons name="search" size={48} color="#a1a1aa" style={{ marginBottom: 12 }} />
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 6, textAlign: 'center' }}>
                {searchQuery.trim().length > 0 ? 'No results found' : 'No matching team members found'}
              </Text>
              <Text style={{ color: '#a1a1aa', fontSize: 15, textAlign: 'center', marginBottom: 8 }}>
                {searchQuery.trim().length > 0 
                  ? `No matches for "${searchQuery}"`
                  : 'Try adjusting the project requirements'}
              </Text>
              {searchQuery.trim().length > 0 && (
                <TouchableOpacity 
                  onPress={() => setSearchQuery('')}
                  style={[styles.clearSearchButton, { backgroundColor: theme.accent + '20' }]}
                >
                  <Text style={[styles.clearSearchText, { color: theme.accent }]}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <FlatList
              data={filteredEmployees}
              keyExtractor={item => item.id.toString()}
              renderItem={renderEmployee}
              contentContainerStyle={{ padding: 16, paddingBottom: 0 }}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>
      )}
        </>
      ) : (
        // Analytics content
        <AnalyticsContent theme={theme} employees={employees} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
  flex: 1,
  backgroundColor: '#23272F',
  borderRadius: 14,
  alignItems: 'center',
  paddingVertical: 8,
  marginBottom: 2,
  borderWidth: 1,
  borderColor: '#353945',
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
  },
  summaryCount: {
  color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 2,
  },
  summaryLabel: {
  color: '#A0ADB8',
    fontWeight: '500',
    fontSize: 13,
    opacity: 0.92,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34,197,94,0.32)', // greenish, less transparent (reverted)
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  header: {
    // unused, replaced by inline style
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 2,
    paddingTop: 20,
  },
  card: {
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#222',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
  },
  role: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 2,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  chip: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  matchScoreBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
  },
  matchScoreText: {
    fontWeight: '600',
    marginLeft: 2,
    marginRight: 6,
  },
  matchScoreLabel: {
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  filterContainer: {
    marginHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#262B36',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#353945',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rangeInputContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  rangeInput: {
    backgroundColor: '#20232A',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#353945',
    minWidth: 70,
    alignItems: 'center',
  },
  rangeSeparator: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  rangeSeparatorText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rangeButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  rangeButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#353945',
  },
  filterIconContainer: {
    flexDirection: 'column',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: 20,
  },
  filterLine: {
    width: 16,
    height: 2,
    marginVertical: 1,
    borderRadius: 1,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  filterIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    backgroundColor: 'rgba(72, 187, 120, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(72, 187, 120, 0.3)',
  },
  filterIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  filterIndicatorText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roleBadge: {
    backgroundColor: 'rgba(72, 187, 120, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  experienceText: {
    fontSize: 11,
    marginLeft: 6,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 4,
  },
  availabilityText: {
    fontSize: 11,
  },
  progressBarContainer: {
    backgroundColor: '#E5E7EB',
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewProfileBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(160, 173, 184, 0.1)',
  },
  // Modern employee card styles
  modernCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarSection: {
    marginRight: 16,
  },
  modernAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  modernAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  headerContent: {
    flex: 1,
    paddingTop: 4,
  },
  modernName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  modernRoleBadge: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  modernRoleText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  yearsText: {
    fontSize: 13,
    marginLeft: 4,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDotModern: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  availabilityTextModern: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  projectInfoText: {
    fontSize: 11,
    fontWeight: '400',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    fontStyle: 'italic',
  },
  statusIndicatorModern: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  statusDotModern: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sectionSpacing: {
    marginBottom: 16,
  },
  modernSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  modernChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modernSkillChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  modernChipText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  modernTechChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modernTechText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  modernFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  matchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  circularProgress: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  matchTextSection: {
    flex: 1,
  },
  matchLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchPercentage: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  availabilityFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  availabilityFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 4,
  },
  availabilityFilterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityFilterText: {
    fontSize: 13,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  // Search styles
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    paddingVertical: 8,
  },
  searchClearButton: {
    padding: 4,
  },
  suggestionsContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(160, 173, 184, 0.2)',
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  suggestionSkeleton: {
    height: 14,
    width: '80%',
    borderRadius: 7,
    marginVertical: 2,
  },
  searchResultsContainer: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  searchResultsText: {
    fontSize: 13,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    fontStyle: 'italic',
  },
  noResultsText: {
    fontSize: 12,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    marginTop: 2,
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 'auto',
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  clearSearchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  clearSearchText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  // Loading and Skeleton Styles
  loadingContainer: {
    flex: 1,
    padding: 16,
  },
  loadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  loadingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  loadingTextContainer: {
    flex: 1,
  },
  loadingTitle: {
    height: 20,
    width: '60%',
    borderRadius: 10,
    marginBottom: 8,
  },
  loadingSubtitle: {
    height: 14,
    width: '40%',
    borderRadius: 7,
  },
  skeletonCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skeletonHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  skeletonAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  skeletonHeaderContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  skeletonName: {
    height: 18,
    width: '70%',
    borderRadius: 9,
    marginBottom: 8,
  },
  skeletonRole: {
    height: 14,
    width: '50%',
    borderRadius: 7,
    marginBottom: 6,
  },
  skeletonExperience: {
    height: 12,
    width: '30%',
    borderRadius: 6,
  },
  skeletonSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  skeletonSkill: {
    height: 24,
    width: 60,
    borderRadius: 12,
  },
  skeletonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skeletonMatch: {
    width: 80,
    height: 40,
    borderRadius: 20,
  },
  skeletonButton: {
    width: 100,
    height: 36,
    borderRadius: 18,
  },
  loadingProgress: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingProgressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    width: '60%',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    textAlign: 'center',
  },
  loadingPulse: {
    backgroundColor: 'rgba(160, 173, 184, 0.2)',
  },
  // Tab styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#262B36',
    borderRadius: 12,
    margin: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#48BB78',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Analytics styles
  analyticsCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyticsSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
});

export default TeamMatchingResults;
