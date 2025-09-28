import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { router } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create theme object based on current color scheme
  const theme = {
    background: Colors[colorScheme ?? 'light'].background,
    text: Colors[colorScheme ?? 'light'].text,
    primary: Colors[colorScheme ?? 'light'].tint,
    card: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
    projectCard: colorScheme === 'dark' ? '#374151' : '#F9FAFB',
    button: Colors[colorScheme ?? 'light'].tint,
    buttonText: '#FFFFFF',
    accent: colorScheme === 'dark' ? '#60A5FA' : '#3B82F6',
    gridDot: Colors[colorScheme ?? 'light'].icon,
    metaText: Colors[colorScheme ?? 'light'].icon,
    badgeHigh: '#EF4444',
    badgeMedium: '#F59E0B',
    badgeLow: '#10B981',
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        // Update the URL below to match your backend endpoint if needed
        const res = await fetch('http://localhost:5214/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching projects');
        // For demo purposes, set some mock data if fetch fails
        setProjects([
          {
            id: 1,
            name: 'Sample Project',
            description: 'This is a sample project description',
            clientName: 'Sample Client',
            estimatedHours: 40,
            budget: '$5,000',
            projectType: 'Web Development',
            priority: 'High'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateProposal = () => {
    // Navigate to modal or another screen
    router.push('/modal');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <GridOverlay dotColor={theme.gridDot} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={[styles.card, { backgroundColor: theme.card, shadowColor: darkMode ? '#000' : '#A0A4B8' }]}>  
          <View style={[styles.header, { backgroundColor: 'linear-gradient(135deg, #0f2d1a 0%, #1a4d2e 100%)', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, shadowColor: '#217a4b', shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 }]}>  
            <Text style={[styles.headerTitle, { color: '#FFFFFF', fontSize: 28, fontWeight: '700', letterSpacing: 0.8, textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2, fontFamily: 'Arial Narrow, Arial, sans-serif' }]}>TalentSync</Text>
            <View style={{ width: 50, height: 2, backgroundColor: '#48BB78', borderRadius: 1, marginVertical: 8 }} />
            <Text style={[styles.headerDesc, { color: 'rgba(255,255,255,0.95)', fontSize: 15, fontWeight: '400', textAlign: 'center', paddingHorizontal: 10, lineHeight: 20, fontFamily: 'Arial Narrow, Arial, sans-serif' }]}>Synchronizing talent with opportunity through AI-powered team matching</Text>
          </View>
          <View style={styles.quickActionsRow}>
            <ActionCard 
              icon="📝" 
              label="Create Proposal" 
              desc="Start a new project proposal" 
              theme={theme} 
              onPress={handleCreateProposal} 
            />
            <ActionCard 
              icon="👥" 
              label="View Team" 
              desc="Browse available employees" 
              theme={theme} 
              onPress={() => {
                // You can navigate to team matching or create a new employee browser
                console.log('Navigate to team view');
              }}
            />
          </View>
          <View style={styles.quickActionsRow}>
            <ActionCard 
              icon="🔧" 
              label="Team Builder" 
              desc="Build and analyze teams" 
              theme={theme} 
              onPress={() => {
                router.push('/team-builder');
              }}
            />
            <ActionCard 
              icon="📊" 
              label="Analytics" 
              desc="View team insights" 
              theme={theme} 
              onPress={() => {
                // This will switch to analytics tab
                router.push('/(tabs)/explore');
              }}
            />
          </View>
          <View style={styles.recentProjectsHeader}>
            <Text style={[styles.recentProjectsTitle, { color: theme.text }]}>Recent Projects</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: theme.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={{ maxHeight: 320, minHeight: 60 }}>
            <ScrollView>
              {loading ? (
                <Text style={{ color: theme.text, marginVertical: 12 }}>Loading...</Text>
              ) : error ? (
                <Text style={{ color: 'red', marginVertical: 12 }}>{error}</Text>
              ) : projects.length === 0 ? (
                <Text style={{ color: theme.text, marginVertical: 12 }}>No projects found.</Text>
              ) : (
                projects.map((p, i) => (
                  <ProjectCard key={p.id || i} project={mapProject(p)} theme={theme} />
                ))
              )}
            </ScrollView>
          </View>
          <TouchableOpacity style={[styles.newProjectBtn, { backgroundColor: theme.button }]} onPress={handleCreateProposal}> 
            <Text style={[styles.newProjectBtnText, { color: theme.buttonText }]}>+ New Project</Text>
          </TouchableOpacity>
          <View style={styles.switchRow}>
            <Text style={{ color: theme.text, marginRight: 8 }}>Dark Mode</Text>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode} 
              thumbColor={darkMode ? theme.primary : theme.accent} 
              trackColor={{ false: theme.gridDot, true: theme.accent }} 
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Map backend project to UI project card fields
function mapProject(p: any) {
  return {
    title: p.name,
    description: p.description,
    company: p.clientName,
    days: p.estimatedHours,
    budget: p.budget,
    type: p.projectType,
    badge: p.priority,
    badgeColor: p.priority === 'High' ? 'badgeHigh' : p.priority === 'Medium' ? 'badgeMedium' : 'badgeLow',
    start: 0, // You can calculate days to start from StartDate if needed
  };
}

function GridOverlay({ dotColor }: { dotColor: string }) {
  const { width, height } = Dimensions.get('window');
  const dotSize = 5;
  const gap = 24;
  const rows = Math.ceil(height / gap);
  const cols = Math.ceil(width / gap);
  const dots = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      dots.push(
        <View
          key={`${x}-${y}`}
          style={{
            position: 'absolute',
            top: y * gap,
            left: x * gap,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: dotColor,
            opacity: 0.18,
          }}
        />
      );
    }
  }
  return <View style={{ position: 'absolute', width, height, zIndex: 0 }}>{dots}</View>;
}

interface ActionCardProps {
  icon: string;
  label: string;
  desc: string;
  theme: any;
  onPress?: () => void;
}

function ActionCard({ icon, label, desc, theme, onPress }: ActionCardProps) {
  // Use white or yellowish for title in dark mode, green in light mode
  const titleColor = theme.text === '#F4F6FB' ? '#fff8b0' : theme.primary;
  return (
    <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.projectCard }]} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={[styles.actionLabel, { color: titleColor }]}>{label}</Text>
      <Text style={[styles.actionDesc, { color: theme.text }]}>{desc}</Text>
    </TouchableOpacity>
  );
}

interface ProjectCardProps {
  project: any;
  theme: any;
}

function ProjectCard({ project, theme }: ProjectCardProps) {
  // Use white or yellowish for title in dark mode, green in light mode
  const titleColor = theme.text === '#F4F6FB' ? '#fff8b0' : theme.primary;
  return (
    <View style={[styles.projectCard, { backgroundColor: theme.projectCard }]}>  
      <View style={styles.projectTitleRow}>
        <Text style={[styles.projectTitle, { color: titleColor }]}>{project.title}</Text>
        <View style={[styles.badge, { backgroundColor: theme[project.badgeColor] }]}>  
          <Text style={styles.badgeText}>{project.badge}</Text>
        </View>
      </View>
      <Text style={[styles.projectDesc, { color: theme.text }]}>{project.description}</Text>
      <View style={styles.projectMetaRow}>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>🏢 {project.company}</Text>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>⏱ {project.days} days</Text>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>💰 {project.budget}</Text>
      </View>
      <View style={styles.projectMetaRow}>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>🔖 {project.type}</Text>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>{project.start > 0 ? `${project.start} days to start` : `${project.start} days to start`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    padding: 18,
    marginVertical: 24,
    alignSelf: 'center',
  },
  header: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  headerDesc: {
    fontSize: 15,
    opacity: 0.85,
    fontWeight: '400',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  actionLabel: {
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  actionDesc: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  recentProjectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recentProjectsTitle: {
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  viewAll: {
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  projectCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  projectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  projectTitle: {
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  badge: {
    marginLeft: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  projectDesc: {
    fontSize: 13,
    marginBottom: 6,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  projectMetaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 2,
  },
  projectMeta: {
    fontSize: 12,
    color: '#008060',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  newProjectBtn: {
    marginTop: 18,
    width: '100%',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  newProjectBtnText: {
    fontWeight: '600',
    fontSize: 16,
  },
  switchRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
