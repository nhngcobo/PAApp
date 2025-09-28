import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  skills: string[];
  matchPercentage: number;
  avatarUrl?: string;
  isAssigned: boolean;
}

interface TeamSlot {
  id: string;
  roleType: string;
  requiredSkills: string[];
  assignedMember?: TeamMember;
}

const TeamBuilderView: React.FC = () => {
  const [availableMembers, setAvailableMembers] = useState<TeamMember[]>([]);
  const [teamSlots, setTeamSlots] = useState<TeamSlot[]>([
    { id: 'frontend', roleType: 'Frontend Developer', requiredSkills: ['React', 'TypeScript'] },
    { id: 'backend', roleType: 'Backend Developer', requiredSkills: ['Node.js', 'SQL'] },
    { id: 'designer', roleType: 'UI/UX Designer', requiredSkills: ['Figma', 'Design'] },
  ]);

  const [draggedMember, setDraggedMember] = useState<TeamMember | null>(null);
  const [teamEffectiveness, setTeamEffectiveness] = useState(0);

  // Drag and Drop Logic
  const createPanResponder = (member: TeamMember) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDraggedMember(member);
      },
      onPanResponderMove: (event, gestureState) => {
        // Handle drag movement
      },
      onPanResponderRelease: (event, gestureState) => {
        // Handle drop logic
        handleMemberDrop(member, gestureState);
        setDraggedMember(null);
      },
    });
  };

  const handleMemberAssignment = (slotId: string, member: TeamMember) => {
    // Update team slots with assigned member
    setTeamSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, assignedMember: member } : slot
    ));
    
    // Remove member from available pool
    setAvailableMembers(prev => prev.filter(m => m.id !== member.id));
    
    // Calculate team effectiveness after assignment
    calculateTeamEffectiveness();
  };

  const handleMemberDrop = (member: TeamMember, gestureState: any) => {
    // Logic to determine which slot the member was dropped on
    // Calculate team effectiveness after assignment
    calculateTeamEffectiveness();
  };

  const calculateTeamEffectiveness = () => {
    // AI-powered team effectiveness calculation
    const assignedSlots = teamSlots.filter(slot => slot.assignedMember);
    const skillsCoverage = calculateSkillsCoverage(assignedSlots);
    const synergy = calculateTeamSynergy(assignedSlots);
    
    setTeamEffectiveness(Math.round((skillsCoverage + synergy) / 2));
  };

  const calculateSkillsCoverage = (slots: TeamSlot[]) => {
    // Calculate how well the team covers required skills
    return 85; // Placeholder
  };

  const calculateTeamSynergy = (slots: TeamSlot[]) => {
    // Calculate team member compatibility
    return 92; // Placeholder
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Team Builder</Text>
        <View style={styles.effectivenessIndicator}>
          <Text style={styles.effectivenessLabel}>Team Effectiveness</Text>
          <Text style={[styles.effectivenessScore, { color: getEffectivenessColor(teamEffectiveness) }]}>
            {teamEffectiveness}%
          </Text>
        </View>
      </View>

      {/* Team Composition Area */}
      <View style={styles.teamComposition}>
        <Text style={styles.sectionTitle}>Project Team</Text>
        <View style={styles.teamSlots}>
          {teamSlots.map(slot => (
            <TeamSlotCard 
              key={slot.id} 
              slot={slot}
              onMemberAssigned={handleMemberAssignment}
            />
          ))}
        </View>
      </View>

      {/* Available Members Pool */}
      <View style={styles.membersPool}>
        <Text style={styles.sectionTitle}>Available Members</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableMembers.map(member => (
            <Animated.View 
              key={member.id}
              {...createPanResponder(member).panHandlers}
            >
              <MemberCard member={member} isDraggable={true} />
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      {/* Team Insights */}
      <View style={styles.insights}>
        <Text style={styles.sectionTitle}>Team Insights</Text>
        <InsightCard 
          title="Skills Coverage" 
          value="94%" 
          trend="up"
          description="All critical skills are covered"
        />
        <InsightCard 
          title="Experience Balance" 
          value="8.2/10" 
          trend="neutral"
          description="Good mix of senior and junior members"
        />
        <InsightCard 
          title="Workload Distribution" 
          value="Balanced" 
          trend="up"
          description="Even capacity across team members"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.saveButton]}>
          <Text style={styles.buttonText}>Save Team</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.analyzeButton]}>
          <Text style={styles.buttonText}>Run Team Analysis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const TeamSlotCard: React.FC<{ slot: TeamSlot; onMemberAssigned: (slotId: string, member: TeamMember) => void }> = ({ slot, onMemberAssigned }) => {
  return (
    <View style={styles.teamSlot}>
      <Text style={styles.slotRole}>{slot.roleType}</Text>
      <View style={styles.slotSkills}>
        {slot.requiredSkills.map(skill => (
          <Text key={skill} style={styles.skillTag}>{skill}</Text>
        ))}
      </View>
      {slot.assignedMember ? (
        <View style={styles.assignedMember}>
          <Text style={styles.memberName}>{slot.assignedMember.name}</Text>
          <Text style={styles.matchScore}>{slot.assignedMember.matchPercentage}% match</Text>
        </View>
      ) : (
        <View style={styles.emptySlot}>
          <Ionicons name="person-add-outline" size={24} color="#666" />
          <Text style={styles.emptySlotText}>Drop member here</Text>
        </View>
      )}
    </View>
  );
};

const MemberCard: React.FC<{ member: TeamMember; isDraggable?: boolean }> = ({ member, isDraggable }) => {
  return (
    <View style={[styles.memberCard, isDraggable && styles.draggableMember]}>
      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={styles.memberRole}>{member.role}</Text>
      <Text style={styles.matchPercentage}>{member.matchPercentage}% match</Text>
      <View style={styles.memberSkills}>
        {member.skills.slice(0, 3).map(skill => (
          <Text key={skill} style={styles.skillTag}>{skill}</Text>
        ))}
      </View>
    </View>
  );
};

const InsightCard: React.FC<{ title: string; value: string; trend: 'up' | 'down' | 'neutral'; description: string }> = ({ title, value, trend, description }) => {
  const trendIcon = trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove';
  const trendColor = trend === 'up' ? '#48BB78' : trend === 'down' ? '#E53E3E' : '#A0ADB8';

  return (
    <View style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightTitle}>{title}</Text>
        <Ionicons name={trendIcon} size={20} color={trendColor} />
      </View>
      <Text style={styles.insightValue}>{value}</Text>
      <Text style={styles.insightDescription}>{description}</Text>
    </View>
  );
};

const getEffectivenessColor = (score: number) => {
  if (score >= 90) return '#48BB78';
  if (score >= 70) return '#F6AD55';
  return '#E53E3E';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  effectivenessIndicator: {
    alignItems: 'center',
  },
  effectivenessLabel: {
    fontSize: 12,
    color: '#A0ADB8',
  },
  effectivenessScore: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  teamComposition: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  teamSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  teamSlot: {
    backgroundColor: '#262B36',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    minHeight: 140,
  },
  slotRole: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  slotSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  skillTag: {
    backgroundColor: '#217a4b',
    color: '#FFFFFF',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  assignedMember: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 4,
  },
  matchScore: {
    color: '#48BB78',
    fontSize: 12,
  },
  emptySlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
  },
  emptySlotText: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  membersPool: {
    marginBottom: 32,
  },
  memberCard: {
    backgroundColor: '#262B36',
    borderRadius: 12,
    padding: 12,
    width: 150,
    marginRight: 12,
  },
  draggableMember: {
    borderWidth: 1,
    borderColor: '#217a4b',
  },
  memberRole: {
    color: '#A0ADB8',
    fontSize: 12,
    marginBottom: 4,
  },
  matchPercentage: {
    color: '#48BB78',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  memberSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  insights: {
    marginBottom: 32,
  },
  insightCard: {
    backgroundColor: '#262B36',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  insightValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#48BB78',
    marginBottom: 4,
  },
  insightDescription: {
    color: '#A0ADB8',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#217a4b',
  },
  analyzeButton: {
    backgroundColor: '#4A5568',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default TeamBuilderView;