import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const theme = {
  background: '#1A1D23',
  text: '#FFFFFF',
  subText: '#A0ADB8',
  primary: '#217a4b',
  card: '#23272F',
  projectCard: '#23272F',
  button: '#48BB78',
  buttonText: '#FFFFFF',
  accent: '#38B2AC',
  gridDot: '#353945',
  metaText: '#A0ADB8',
  badgeHigh: '#E53E3E',
  badgeMedium: '#38B2AC',
  badgeLow: '#48BB78',
  cardBorder: '#353945',
};

export default function RecentProjectsScreen() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pulseOpacity = new Animated.Value(0.3);

  useEffect(() => {
    // Pulse animation for skeleton loading
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseOpacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );
    pulse.start();

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
        console.error('Failed to fetch projects:', err);
        setError(err.message || 'Error fetching projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    return () => pulse.stop();
  }, []);

  const handleCreateProposal = () => {
    router.push('/create-proposal');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <GridOverlay dotColor={theme.gridDot} />
      
      {/* Back Arrow Header */}
      <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', marginBottom: 12, height: 32, marginTop: 30, paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 20, zIndex: 2, paddingLeft: 8 }}>
          <Text style={{ color: '#fff', fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.pageTitle, { color: '#fff', marginBottom: 0, textAlign: 'center' }]}>Recent Projects</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={{ flex: 1, minHeight: 60, marginBottom: 80 }}>
            <ScrollView>
              {loading ? (
                // Skeleton Loading for Project Cards
                [1, 2, 3].map((index) => (
                  <View key={index} style={[styles.skeletonProjectCard, { backgroundColor: theme.projectCard }]}>
                    <View style={styles.skeletonProjectHeader}>
                      <Animated.View style={[styles.skeletonPulse, styles.skeletonProjectName, { opacity: pulseOpacity }]} />
                      <Animated.View style={[styles.skeletonPulse, styles.skeletonProjectBadge, { opacity: pulseOpacity }]} />
                    </View>
                    <Animated.View style={[styles.skeletonPulse, styles.skeletonProjectDesc, { opacity: pulseOpacity }]} />
                    <Animated.View style={[styles.skeletonPulse, styles.skeletonProjectDesc2, { opacity: pulseOpacity }]} />
                    <View style={styles.skeletonProjectMeta}>
                      <Animated.View style={[styles.skeletonPulse, styles.skeletonMeta, { opacity: pulseOpacity }]} />
                      <Animated.View style={[styles.skeletonPulse, styles.skeletonMeta, { opacity: pulseOpacity }]} />
                      <Animated.View style={[styles.skeletonPulse, styles.skeletonMeta, { opacity: pulseOpacity }]} />
                    </View>
                  </View>
                ))
              ) : error ? (
                <View style={styles.emptyState}>
                  <Ionicons name="alert-circle-outline" size={48} color={theme.badgeHigh} style={{ marginBottom: 16 }} />
                  <Text style={[styles.emptyStateTitle, { color: theme.text }]}>Failed to Load Projects</Text>
                  <Text style={[styles.emptyStateSubtitle, { color: theme.subText }]}>{error}</Text>
                  <TouchableOpacity 
                    style={[styles.retryButton, { backgroundColor: theme.button }]} 
                    onPress={() => window.location.reload()}
                  >
                    <Text style={[styles.retryButtonText, { color: theme.buttonText }]}>Try Again</Text>
                  </TouchableOpacity>
                </View>
              ) : projects.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="folder-open-outline" size={48} color={theme.subText} style={{ marginBottom: 16 }} />
                  <Text style={[styles.emptyStateTitle, { color: theme.text }]}>No Projects Found</Text>
                  <Text style={[styles.emptyStateSubtitle, { color: theme.subText }]}>You haven't created any projects yet.{"\n"}Get started by creating your first project!</Text>
                  <TouchableOpacity 
                    style={[styles.createButton, { backgroundColor: theme.button }]} 
                    onPress={handleCreateProposal}
                  >
                    <Ionicons name="add" size={20} color={theme.buttonText} style={{ marginRight: 8 }} />
                    <Text style={[styles.createButtonText, { color: theme.buttonText }]}>Create Project</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                projects.map((p, i) => (
                  <ProjectCard key={p.id || i} project={mapProject(p)} theme={theme} />
                ))
              )}
            </ScrollView>
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

interface ProjectCardProps {
  project: any;
  theme: any;
}

function ProjectCard({ project, theme }: ProjectCardProps) {
  return (
    <View style={[styles.projectCard, { backgroundColor: theme.projectCard, borderColor: theme.cardBorder }]}>  
      <View style={styles.projectTitleRow}>
        <Text style={[styles.projectTitle, { color: '#FFFFFF' }]}>{project.title}</Text>
        <View style={[styles.badge, { backgroundColor: theme[project.badgeColor] }]}>  
          <Text style={styles.badgeText}>{project.badge}</Text>
        </View>
      </View>
      <Text style={[styles.projectDesc, { color: theme.metaText }]}>{project.description}</Text>
      <View style={styles.projectMetaRow}>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>🏢 {project.company}</Text>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>⏱ {project.days} hours</Text>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>💰 R{project.budget}</Text>
      </View>
      <View style={styles.projectMetaRow}>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>🔖 {project.type}</Text>
        <Text style={[styles.projectMeta, { color: theme.metaText }]}>📅 {project.start} days to start</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: '#F4F6FB',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 2,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    padding: 20,
    marginVertical: 0,
    alignSelf: 'center',
  },
  projectCard: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    backgroundColor: '#4A5568',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  projectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  projectTitle: {
    fontWeight: '700',
    fontSize: 18,
    flex: 1,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 11,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  projectDesc: {
    fontSize: 15,
    marginBottom: 14,
    opacity: 0.9,
    lineHeight: 20,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  projectMetaRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 6,
  },
  projectMeta: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  // Skeleton Loading Styles
  skeletonProjectCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skeletonProjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonProjectName: {
    height: 20,
    width: '60%',
    borderRadius: 10,
  },
  skeletonProjectBadge: {
    height: 24,
    width: 60,
    borderRadius: 12,
  },
  skeletonProjectDesc: {
    height: 16,
    width: '100%',
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonProjectDesc2: {
    height: 16,
    width: '75%',
    borderRadius: 8,
    marginBottom: 16,
  },
  skeletonProjectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonMeta: {
    height: 14,
    width: '25%',
    borderRadius: 7,
  },
  skeletonPulse: {
    backgroundColor: 'rgba(160, 173, 184, 0.2)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
});