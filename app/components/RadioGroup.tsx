import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons'; // <-- 1. Mude a importação para Feather

interface RadioGroupProps {
  label: string;
  options: string[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, selectedValue, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.option}
            onPress={() => onValueChange(option)}
            activeOpacity={0.7}
          >
            {/* 2. Troque o componente e os nomes dos ícones */}
            <Feather
              name={selectedValue === option ? 'check-circle' : 'circle'}
              size={24}
              color={selectedValue === option ? '#FFA500' : '#757575'}
            />
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFA500',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#434343',
  },
});

export default RadioGroup;