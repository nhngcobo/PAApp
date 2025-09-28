import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
// import { getAllEmployees } from '../api/employees';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SkillModal from './SkillModal';
import TechnologyModal from './TechnologyModal';

// Custom Dropdown Component using Modal for better z-index control
interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  style?: any;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, options, onChange, placeholder, style }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <TouchableOpacity
        style={[{
          borderRadius: 8,
          backgroundColor: '#23272F',
          height: 44,
          marginBottom: 10,
          paddingHorizontal: 12,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#353945',
        }, style]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontFamily: 'Arial Narrow, Arial, sans-serif' }}>{value || placeholder}</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#A0ADB8" />
      </TouchableOpacity>
      
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={() => setIsOpen(false)}
        >
          <View style={{
            position: 'absolute',
            top: 200, // Adjust this based on your dropdown position
            left: 40,
            right: 40,
            backgroundColor: '#23272F',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#353945',
            maxHeight: 200,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 20,
          }}>
            <ScrollView style={{ maxHeight: 200 }}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderBottomWidth: options.indexOf(option) < options.length - 1 ? 1 : 0,
                    borderBottomColor: '#353945',
                  }}
                  onPress={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  <Text style={{ color: value === option ? '#48BB78' : '#fff', fontSize: 15, fontFamily: 'Arial Narrow, Arial, sans-serif' }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};


const SKILL_OPTIONS = [
  // Frontend & Design Skills
  'UI/UX Design',
  'Responsive Design',
  'User Research',
  'Usability Testing',
  'Wireframing',
  'Accessibility',
  
  // Backend & Development Skills
  'Problem Solving',
  'Communication',
  'System Architecture',
  'Code Review',
  'Performance Optimization',
  'API Development',
  'RESTful Services',
  'Debugging',
  'Documentation',
  
  // Data & Analytics Skills
  'Data Analysis',
  'Machine Learning',
  'Python',
  'ETL Development',
  'Data Warehousing',
  'SQL Optimization',
  'Financial Modeling',
  'Forecasting',
  
  // DevOps & Infrastructure Skills
  'CI/CD',
  'Infrastructure as Code',
  'Monitoring',
  'Risk Assessment',
  'Incident Response',
  'Network Security',
  
  // Quality & Testing Skills
  'Test Automation',
  'Manual Testing',
  'Documentation',
  
  // Management & Leadership Skills
  'Team Leadership',
  'Agile',
  'Project Management',
  'Budgeting',
  'Stakeholder Engagement',
  'Agile Coaching',
  'Sprint Planning',
  'Team Facilitation',
  
  // Business Skills
  'Strategic Planning',
  'Process Improvement',
  'Vendor Management',
  'Recruitment',
  'Employee Relations',
  'Policy Development',
  'Content Creation',
  'Campaign Management',
  'SEO',
  'Contract Review',
  'Compliance',
  'Legal Research'
];

const TECHNOLOGY_OPTIONS = [
  // Frontend Technologies
  'React',
  'TypeScript',
  'Next.js',
  'Tailwind CSS',
  'Vue.js',
  'Angular',
  'GraphQL',
  'HTML',
  'CSS',
  
  // Backend Technologies
  'Node.js',
  'Express.js',
  'Java',
  'Spring Boot',
  'Python',
  'FastAPI',
  'REST APIs',
  '.NET',
  
  // Databases
  'PostgreSQL',
  'MongoDB',
  'SQL Server',
  'SQL',
  'Hive',
  
  // Cloud & DevOps
  'Azure',
  'AWS',
  'Terraform',
  'Jenkins',
  'Kubernetes',
  
  // Data & Analytics
  'R',
  'TensorFlow',
  'Spark',
  'Python',
  'Power BI',
  'Excel',
  
  // Testing & QA
  'Selenium',
  'Postman',
  'JIRA',
  
  // Security
  'Wireshark',
  'Splunk',
  'Nessus',
  
  // Design Tools
  'Figma',
  'Miro',
  'Sketch',
  
  // Documentation
  'Swagger'
];

const CreateProposal = ({ navigation }: any) => {
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [clientName, setClientName] = useState('');
  const [industry, setIndustry] = useState('');
  const [projectType, setProjectType] = useState('Web Application');
  const [skills, setSkills] = useState<string[]>([]);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [showTechModal, setShowTechModal] = useState(false);
  const [estimatedHours, setEstimatedHours] = useState('');
  const [budget, setBudget] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const projectTypes = [
    'Web Application',
    'Mobile Application',
    'Desktop Application',
    'Full Stack',
    'Backend',
    'Frontend',
    'Data Science',
    'AI/Machine Learning',
    'DevOps',
    'Advisory',
    'Strategy',
    'Risk',
    'Transformation',
    'Cybersecurity',
    'Cloud Migration',
    'Change Management',
    'Process Improvement',
    'Other',
  ];
  const [priority, setPriority] = useState('Medium');
  const [startDate, setStartDate] = useState('16/9/2025');
  const [endDate, setEndDate] = useState('16/10/2025');


  const validateFields = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!projectName.trim()) newErrors.projectName = true;
    if (!projectDesc.trim()) newErrors.projectDesc = true;
    if (!clientName.trim()) newErrors.clientName = true;
    if (!industry.trim()) newErrors.industry = true;
    if (!budget.trim()) newErrors.budget = true;
    if (!estimatedHours.trim()) newErrors.estimatedHours = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nav = navigation || useNavigation();
  const handleFindMatching = async () => {
    if (!validateFields()) {
      return;
    }
    // Navigate to team-matching-results with skills and technologies
    if (navigation) {
      navigation.navigate('team-matching-results', {
        requirements: {
          skills,
          technologies
        }
      });
    } else {
      nav.navigate('team-matching-results', {
        requirements: {
          skills,
          technologies
        }
      });
    }
  };

  return (
  <ScrollView style={{ flex: 1, backgroundColor: '#20232A' }} contentContainerStyle={{ padding: 18 }}>
      <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', marginBottom: 12, height: 32 }}>
  <TouchableOpacity onPress={() => navigation?.navigate ? navigation.navigate('index') : nav.navigate('index')} style={{ position: 'absolute', left: 0, zIndex: 2, paddingLeft: 8 }}>
          <Ionicons name="arrow-back" size={24} color={'#fff'} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.title, { color: '#fff', marginBottom: 0, textAlign: 'center' }]}>New Project Proposal</Text>
        </View>
      </View>
      <Text style={[styles.section, { color: '#fff' }]}>Project Details</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: '#23272F',
            color: '#fff',
            borderColor: errors.projectName ? 'red' : '#262B36',
          },
        ]}
        placeholder="Project Name"
  placeholderTextColor={'#A0ADB8'}
        value={projectName}
        onChangeText={text => { setProjectName(text); if (errors.projectName) setErrors(e => ({ ...e, projectName: false })); }}
      />
      <TextInput
        style={[
          styles.input,
          {
            height: 70,
            backgroundColor: '#23272F',
            color: '#fff',
            borderColor: errors.projectDesc ? 'red' : '#262B36',
          },
        ]}
        placeholder="Project Description"
  placeholderTextColor={'#A0ADB8'}
        value={projectDesc}
        onChangeText={text => { setProjectDesc(text); if (errors.projectDesc) setErrors(e => ({ ...e, projectDesc: false })); }}
        multiline
      />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput
          style={[
            styles.input,
            {
              flex: 1,
              backgroundColor: '#23272F',
              color: '#fff',
              borderColor: errors.clientName ? 'red' : '#262B36',
            },
          ]}
          placeholder="Client Name"
    placeholderTextColor={'#A0ADB8'}
          value={clientName}
          onChangeText={text => { setClientName(text); if (errors.clientName) setErrors(e => ({ ...e, clientName: false })); }}
        />
        <TextInput
          style={[
            styles.input,
            {
              width: '100%',
              backgroundColor: '#23272F',
              color: '#fff',
              borderColor: errors.industry ? 'red' : '#262B36',
            },
          ]}
          placeholder="Industry"
          placeholderTextColor={'#A0ADB8'}
          value={industry}
          onChangeText={text => { setIndustry(text); if (errors.industry) setErrors(e => ({ ...e, industry: false })); }}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <CustomDropdown
          value={projectType}
          options={projectTypes}
          onChange={setProjectType}
          placeholder="Select Project Type"
        />
        <CustomDropdown
          value={priority}
          options={['Low', 'Medium', 'High', 'Critical']}
          onChange={setPriority}
          placeholder="Select Priority"
        />
      </View>
  <Text style={[styles.section, { color: '#fff' }]}>Requirements</Text>
  <Text style={[styles.label, { color: '#A0ADB8' }]}>Required Skills</Text>
      <View style={{ marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', minHeight: 40 }}>
          {skills.map((skill) => (
            <View key={skill} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#23272F', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 6, borderWidth: 1, borderColor: '#48BB78' }}>
              <Text style={{ color: '#fff', marginRight: 6 }}>{skill}</Text>
              <TouchableOpacity onPress={() => setSkills(skills.filter(s => s !== skill))} style={{ marginLeft: 2 }}>
                <Ionicons name="close-circle" size={16} color="#48BB78" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={() => setShowSkillModal(true)} style={[styles.addBtn, { borderColor: '#48BB78', alignSelf: 'flex-start', marginTop: 4 }]}> 
          <Ionicons name="add-circle-outline" size={18} color={'#48BB78'} />
          <Text style={[styles.addBtnText, { color: '#48BB78' }]}>Add Skills</Text>
        </TouchableOpacity>
      </View>

      <SkillModal
        visible={showSkillModal}
        skills={skills}
        setSkills={setSkills}
        onClose={() => setShowSkillModal(false)}
        skillOptions={SKILL_OPTIONS}
        theme={{
          background: '#20232A',
          text: '#FFFFFF',
          primary: '#217a4b',
          card: '#262B36',
          projectCard: '#23272F',
          button: '#217a4b',
          buttonText: '#FFFFFF',
          accent: '#48BB78',
          gridDot: '#353945',
          metaText: '#A0ADB8',
          badgeHigh: '#E53E3E',
          badgeMedium: '#48BB78',
          badgeLow: '#48BB78',
          cardBorder: '#353945',
        }}
      />
  <Text style={[styles.label, { color: '#A0ADB8' }]}>Required Technologies</Text>
      <View style={{ marginBottom: 6 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', minHeight: 40 }}>
          {technologies.map((tech) => (
            <View key={tech} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#23272F', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 6, borderWidth: 1, borderColor: '#48BB78' }}>
              <Text style={{ color: '#fff', marginRight: 6 }}>{tech}</Text>
              <TouchableOpacity onPress={() => setTechnologies(technologies.filter(t => t !== tech))} style={{ marginLeft: 2 }}>
                <Ionicons name="close-circle" size={16} color="#48BB78" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={() => setShowTechModal(true)} style={[styles.addBtn, { borderColor: '#48BB78', alignSelf: 'flex-start', marginTop: 4 }]}> 
          <Ionicons name="add-circle-outline" size={18} color={'#48BB78'} />
          <Text style={[styles.addBtnText, { color: '#48BB78' }]}>Add Technologies</Text>
        </TouchableOpacity>
      </View>

      <TechnologyModal
        visible={showTechModal}
        technologies={technologies}
        setTechnologies={setTechnologies}
        onClose={() => setShowTechModal(false)}
        technologyOptions={TECHNOLOGY_OPTIONS}
        title="Select Technologies"
        theme={{
          background: '#20232A',
          text: '#FFFFFF',
          primary: '#217a4b',
          card: '#262B36',
          projectCard: '#23272F',
          button: '#217a4b',
          buttonText: '#FFFFFF',
          accent: '#48BB78',
          gridDot: '#353945',
          metaText: '#A0ADB8',
          badgeHigh: '#E53E3E',
          badgeMedium: '#48BB78',
          badgeLow: '#48BB78',
          cardBorder: '#353945',
        }}
      />
  <Text style={[styles.section, { color: '#fff' }]}>Timeline & Budget</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: '#A0ADB8' }]}>Start Date</Text>
          <TouchableOpacity style={[styles.dateInput, { backgroundColor: '#23272F', borderColor: '#262B36' }]}> 
            <Ionicons name="calendar-outline" size={16} color={'#A0ADB8'} />
            <Text style={[styles.dateText, { color: '#fff' }]}>{startDate}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.label, { color: '#A0ADB8' }]}>End Date</Text>
          <TouchableOpacity style={[styles.dateInput, { backgroundColor: '#23272F', borderColor: '#262B36' }]}> 
            <Ionicons name="calendar-outline" size={16} color={'#A0ADB8'} />
            <Text style={[styles.dateText, { color: '#fff' }]}>{endDate}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TextInput
          style={[
            styles.input,
              { flex: 1, backgroundColor: '#23272F', color: '#fff', borderColor: errors.estimatedHours ? 'red' : '#262B36' }
          ]}
          placeholder="Estimated Hours"
            placeholderTextColor={'#A0ADB8'}
          value={estimatedHours}
          onChangeText={text => { setEstimatedHours(text); if (errors.estimatedHours) setErrors(e => ({ ...e, estimatedHours: false })); }}
        />
        <TextInput
          style={[
            styles.input,
              { flex: 1, backgroundColor: '#23272F', color: '#fff', borderColor: errors.budget ? 'red' : '#262B36' }
          ]}
          placeholder="Budget (R)"
            placeholderTextColor={'#A0ADB8'}
          value={budget}
          onChangeText={text => { setBudget(text); if (errors.budget) setErrors(e => ({ ...e, budget: false })); }}
        />
      </View>
      <TouchableOpacity style={[styles.findBtn, { borderColor: '#48BB78' }]} onPress={handleFindMatching}>
       <Text style={[styles.findBtnText, { color: '#48BB78' }]}>Find Matching Team Members</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    color: '#F4F6FB',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 2,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  section: {
    color: '#F4F6FB',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 8,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  label: {
    color: '#A0A4B8',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 2,
    marginLeft: 2,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  input: {
    backgroundColor: '#23262F',
    color: '#F4F6FB',
    borderRadius: 8,
    paddingHorizontal: 12,
  paddingVertical: 12,
    fontSize: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#353945',
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00b388',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
    marginTop: 2,
  },
  addBtnText: {
    color: '#00b388',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
    fontFamily: 'Arial Narrow, Arial, sans-serif',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23262F',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#353945',
  },
  dateText: {
    color: '#F4F6FB',
    fontSize: 15,
    marginLeft: 6,
  },
  findBtn: {
    marginTop: 18,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#00b388',
    borderRadius: 22,
    paddingVertical: 13,
    alignItems: 'center',
  },
  findBtnText: {
    color: '#00b388',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default CreateProposal;
