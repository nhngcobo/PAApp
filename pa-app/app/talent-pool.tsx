import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SkillModal from '../components/SkillModal';
import TechnologyModal from '../components/TechnologyModal';

const SKILL_OPTIONS = [
  'UI/UX Design', 'Responsive Design', 'User Research', 'Usability Testing', 'Wireframing', 'Accessibility',
  'Problem Solving', 'Communication', 'System Architecture', 'Code Review', 'Performance Optimization',
  'API Development', 'RESTful Services', 'Debugging', 'Documentation', 'Data Analysis', 'Machine Learning',
  'Python', 'ETL Development', 'Data Warehousing', 'SQL Optimization', 'Financial Modeling', 'Forecasting',
  'CI/CD', 'Infrastructure as Code', 'Monitoring', 'Risk Assessment', 'Incident Response', 'Network Security',
  'Test Automation', 'Manual Testing', 'Team Leadership', 'Agile', 'Project Management', 'Budgeting',
  'Stakeholder Engagement', 'Agile Coaching', 'Sprint Planning', 'Team Facilitation', 'Strategic Planning',
  'Process Improvement', 'Vendor Management', 'Recruitment', 'Employee Relations', 'Policy Development',
  'Content Creation', 'Campaign Management', 'SEO', 'Contract Review', 'Compliance', 'Legal Research'
];

const TECHNOLOGY_OPTIONS = [
  'React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Vue.js', 'Angular', 'GraphQL', 'HTML', 'CSS',
  'Node.js', 'Express.js', 'Java', 'Spring Boot', 'Python', 'FastAPI', 'REST APIs', '.NET',
  'PostgreSQL', 'MongoDB', 'SQL Server', 'SQL', 'Hive', 'Azure', 'AWS', 'Terraform', 'Jenkins',
  'Kubernetes', 'R', 'TensorFlow', 'Spark', 'Power BI', 'Excel', 'Selenium', 'Postman', 'JIRA',
  'Wireshark', 'Splunk', 'Nessus', 'Figma', 'Miro', 'Sketch', 'Swagger'
];

const theme = {
  background: '#1A1D23',
  text: '#FFFFFF',
  subText: '#A0ADB8',
  primary: '#217a4b',
  card: '#23272F',
  projectCard: '#23272F',
  button: '#38B2AC',
  buttonText: '#FFFFFF',
  accent: '#38B2AC',
  gridDot: '#353945',
  metaText: '#A0ADB8',
  badgeHigh: '#E53E3E',
  badgeMedium: '#38B2AC',
  badgeLow: '#48BB78',
  cardBorder: '#353945',
};

export default function TalentPoolScreen() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5214/api/employees');
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        
        // Process the data to convert comma-separated strings to arrays
        const processedEmployees = data.map((employee: any) => ({
          ...employee,
          skills: typeof employee.skills === 'string' 
            ? employee.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
            : Array.isArray(employee.skills) ? employee.skills : [],
          technologies: typeof employee.technologies === 'string'
            ? employee.technologies.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
            : Array.isArray(employee.technologies) ? employee.technologies : [],
          experience: employee.experienceYears ? `${employee.experienceYears} years` : employee.experience || '0 years'
        }));
        
        setEmployees(processedEmployees);
        setFilteredEmployees(processedEmployees);
      } catch (err: any) {
        console.error('Failed to fetch employees:', err);
        setError(err.message || 'Failed to fetch employees');
        setEmployees([]);
        setFilteredEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchText, selectedSkills, selectedTechnologies, employees]);

  const filterEmployees = () => {
    let filtered = employees;

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(emp => {
        const empSkills = Array.isArray(emp.skills) ? emp.skills : [];
        return selectedSkills.some(skill => empSkills.includes(skill));
      });
    }

    // Filter by technologies
    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter(emp => {
        const empTechnologies = Array.isArray(emp.technologies) ? emp.technologies : [];
        return selectedTechnologies.some(tech => empTechnologies.includes(tech));
      });
    }

    setFilteredEmployees(filtered);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedSkills([]);
    setSelectedTechnologies([]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Talent Pool</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContainer}>
        {/* Search & Filters Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search & Filters</Text>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, role, or department..."
            placeholderTextColor={theme.metaText}
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* Skills Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Filter by Skills</Text>
            <View style={styles.selectedItems}>
              {selectedSkills.map((skill) => (
                <View key={skill} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{skill}</Text>
                  <TouchableOpacity onPress={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}>
                    <Ionicons name="close" size={16} color={theme.accent} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowSkillModal(true)} style={styles.addButton}>
              <Ionicons name="add" size={20} color={theme.accent} />
              <Text style={styles.addButtonText}>Add Skills</Text>
            </TouchableOpacity>
          </View>

          {/* Technologies Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Filter by Technologies</Text>
            <View style={styles.selectedItems}>
              {selectedTechnologies.map((tech) => (
                <View key={tech} style={styles.selectedTag}>
                  <Text style={styles.selectedTagText}>{tech}</Text>
                  <TouchableOpacity onPress={() => setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech))}>
                    <Ionicons name="close" size={16} color={theme.accent} style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => setShowTechModal(true)} style={styles.addButton}>
              <Ionicons name="add" size={20} color={theme.accent} />
              <Text style={styles.addButtonText}>Add Technologies</Text>
            </TouchableOpacity>
          </View>

          {(selectedSkills.length > 0 || selectedTechnologies.length > 0 || searchText.trim()) && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Results Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Results</Text>
          <Text style={styles.resultsSubtitle}>
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'Person' : 'People'} Found
          </Text>

          {loading ? (
            <Text style={{ color: theme.text, textAlign: 'center', marginTop: 40 }}>Loading...</Text>
          ) : (
            filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} theme={theme} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <SkillModal
        visible={showSkillModal}
        skills={selectedSkills}
        setSkills={setSelectedSkills}
        onClose={() => setShowSkillModal(false)}
        skillOptions={SKILL_OPTIONS}
        theme={theme}
      />

      <TechnologyModal
        visible={showTechModal}
        technologies={selectedTechnologies}
        setTechnologies={setSelectedTechnologies}
        onClose={() => setShowTechModal(false)}
        technologyOptions={TECHNOLOGY_OPTIONS}
        title="Select Technologies"
        theme={theme}
      />
    </View>
  );
}

interface EmployeeCardProps {
  employee: any;
  theme: any;
}

function EmployeeCard({ employee, theme }: EmployeeCardProps) {
  return (
    <View style={[styles.employeeCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.employeeHeader}>
        {/* Employee Avatar */}
        <View style={styles.avatarContainer}>
          {employee.avatarUrl ? (
            <Image 
              source={{ uri: `http://localhost:5214${employee.avatarUrl}` }} 
              style={styles.avatar}
              defaultSource={require('../assets/images/icon.png')}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="#A0ADB8" />
            </View>
          )}
        </View>
        
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.employeeName, { color: theme.text }]}>{employee.name}</Text>
          <Text style={[styles.employeeRole, { color: theme.subText }]}>{employee.role}</Text>
          <Text style={[styles.employeeDept, { color: theme.metaText }]}>{employee.department}</Text>
          <Text style={[styles.experienceYears, { color: theme.metaText, marginBottom: 8 }]}>({employee.experience || '0 years'} experience)</Text>
        </View>
        
        <View style={[styles.availabilityBadge, { 
          backgroundColor: employee.availability === 'Available' ? theme.badgeLow : '#6B7280'
        }]}>
          <Text style={styles.availabilityText}>{employee.availability}</Text>
        </View>
      </View>

      <View style={styles.skillsSection}>
        <Text style={[styles.skillsLabel, { color: theme.subText }]}>Skills:</Text>
        <View style={styles.skillsContainer}>
          {(Array.isArray(employee.skills) ? employee.skills : []).length === 0 ? (
            <Text style={[styles.noDataText, { color: theme.metaText }]}>No skills listed</Text>
          ) : (
            (Array.isArray(employee.skills) ? employee.skills : []).slice(0, 3).map((skill: string) => (
              <View key={skill} style={[styles.skillTag, { borderColor: theme.accent }]}>
                <Text style={[styles.skillTagText, { color: theme.accent }]}>{skill}</Text>
              </View>
            ))
          )}
          {(Array.isArray(employee.skills) ? employee.skills : []).length > 3 && (
            <Text style={[styles.moreSkills, { color: theme.metaText }]}>+{employee.skills.length - 3} more</Text>
          )}
        </View>
      </View>

      <View style={styles.techSection}>
        <Text style={[styles.techLabel, { color: theme.subText }]}>Technologies:</Text>
        <View style={styles.techContainer}>
          {(Array.isArray(employee.technologies) ? employee.technologies : []).length === 0 ? (
            <Text style={[styles.noDataText, { color: theme.metaText }]}>No technologies listed</Text>
          ) : (
            (Array.isArray(employee.technologies) ? employee.technologies : []).slice(0, 3).map((tech: string) => (
              <View key={tech} style={[styles.techTag, { backgroundColor: theme.primary }]}>
                <Text style={[styles.techTagText, { color: theme.buttonText }]}>{tech}</Text>
              </View>
            ))
          )}
          {(Array.isArray(employee.technologies) ? employee.technologies : []).length > 3 && (
            <Text style={[styles.moreTech, { color: theme.metaText }]}>+{employee.technologies.length - 3} more</Text>
          )}
        </View>
      </View>

      <View style={styles.employeeFooter}>
        <Text style={[styles.emailText, { color: theme.metaText }]}>{employee.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1A1D23',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 40, // Offset for back button
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    backgroundColor: '#23272F',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#353945',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  searchInput: {
    backgroundColor: '#1A1D23',
    color: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#353945',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#A0ADB8',
    marginBottom: 8,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  selectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    minHeight: 20,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48BB78',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#48BB78',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: '#48BB78',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  clearButton: {
    backgroundColor: '#E53E3E',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#A0ADB8',
    marginBottom: 16,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  employeeCard: {
    backgroundColor: '#1A1D23',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#353945',
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#353945',
    alignItems: 'center',
    justifyContent: 'center',
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  employeeRole: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  employeeDept: {
    fontSize: 13,
    marginBottom: 4,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  experienceYears: {
    fontSize: 13,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  skillsSection: {
    marginBottom: 16,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  techSection: {
    marginBottom: 16,
  },
  techLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  techTag: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  techTagText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  employeeFooter: {
    borderTopWidth: 1,
    borderTopColor: '#353945',
    paddingTop: 16,
    alignItems: 'center',
  },
  emailText: {
    fontSize: 13,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  moreSkills: {
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    alignSelf: 'center',
    marginTop: 4,
  },
  moreTech: {
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
    alignSelf: 'center',
    marginTop: 4,
  },
  noDataText: {
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
});