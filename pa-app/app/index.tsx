import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const theme = {
    background: '#1A1D23',
    text: '#FFFFFF',
    subText: '#A0ADB8',
    primary: '#217a4b',
    button: '#217a4b',
    buttonText: '#FFFFFF',
    secondaryButton: '#23272F',
    secondaryButtonText: '#FFFFFF',
    cardBorder: '#353945',
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          paddingHorizontal: 16, 
          paddingVertical: 80 
        }}
      >
        <View style={styles.heroSection}>
          <Text style={[styles.mainTitle, { color: theme.text }]}>TalentSync</Text>
          <Text style={[styles.mainSubtitle, { color: theme.subText }]}>
            Synchronizing talent with opportunity through{"\n"}AI-powered team matching
          </Text>
          
          <View style={styles.heroButtons}>
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: theme.button }]} 
              onPress={() => router.push('/recent-projects')}
            >
              <Text style={[styles.primaryButtonText, { color: theme.buttonText }]}>
                Recent Projects
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.secondaryButton, { 
                backgroundColor: theme.secondaryButton, 
                borderColor: theme.cardBorder 
              }]} 
              onPress={() => router.push('/create-proposal')}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.secondaryButtonText }]}>
                + Create Project
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tertiaryButton, { backgroundColor: '#38B2AC' }]} 
              onPress={() => router.push('/talent-pool')}
            >
              <Text style={[styles.tertiaryButtonText, { color: '#FFFFFF' }]}>
                🔍 Talent Pool
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 600,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  mainSubtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
    maxWidth: 500,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  heroButtons: {
    flexDirection: 'column',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 250,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 250,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  tertiaryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 250,
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    textAlign: 'center',
  },
});