import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SimpleAnalytics: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="analytics-outline" size={32} color="#48BB78" />
        <Text style={styles.title}>Analytics Dashboard</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Team Capacity</Text>
          <Text style={styles.cardValue}>6 Available</Text>
          <Text style={styles.cardSubtext}>Out of 20 total employees</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Utilization Rate</Text>
          <Text style={styles.cardValue}>70%</Text>
          <Text style={styles.cardSubtext}>Current team utilization</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Critical Skill Gaps</Text>
          <Text style={styles.cardValue}>3 Areas</Text>
          <Text style={styles.cardSubtext}>React Native, Azure, UI/UX</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Availability</Text>
          <Text style={styles.cardValue}>5 Employees</Text>
          <Text style={styles.cardSubtext}>Available within 2 months</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#262B36',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#262B36',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#48BB78',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0ADB8',
    marginBottom: 8,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#A0ADB8',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
});

export default SimpleAnalytics;