import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TechnologyModalProps {
  visible: boolean;
  technologies: string[];
  setTechnologies: (techs: string[]) => void;
  onClose: () => void;
  theme: any;
  technologyOptions: string[];
  title?: string;
}

const TechnologyModal: React.FC<TechnologyModalProps> = ({ visible, technologies, setTechnologies, onClose, theme, technologyOptions, title }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 280, maxHeight: 520, backgroundColor: theme.background, borderRadius: 24, paddingVertical: 18, alignItems: 'stretch', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 }}>
          <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 18, marginLeft: 20, marginBottom: 10, fontFamily: 'Arial Narrow, Arial, sans-serif' }}>{title || 'Select Technologies'}</Text>
          <ScrollView style={{ flexGrow: 0, maxHeight: 380 }} showsVerticalScrollIndicator>
            {technologyOptions.map((tech) => {
              const selected = technologies.includes(tech);
              return (
                <TouchableOpacity
                  key={tech}
                  onPress={() => {
                    setTechnologies(
                      selected
                        ? technologies.filter((t) => t !== tech)
                        : [...technologies, tech]
                    );
                  }}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 }}
                >
                  <View style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    borderWidth: 2,
                    borderColor: selected ? theme.primary : theme.metaText,
                    backgroundColor: selected ? theme.primary : 'transparent',
                    marginRight: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {selected && (
                      <Ionicons name="checkmark" size={16} color={theme.buttonText} />
                    )}
                  </View>
                  <Text style={{ color: theme.text, fontSize: 16, fontFamily: 'Arial Narrow, Arial, sans-serif' }}>{tech}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            onPress={onClose}
            style={{ alignSelf: 'flex-end', marginTop: 10, marginRight: 20 }}
          >
            <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 16, fontFamily: 'Arial Narrow, Arial, sans-serif' }}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TechnologyModal;
