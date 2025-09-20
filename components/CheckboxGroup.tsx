import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CheckboxGroupProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  quantidadePorLinha?: number;
  style?: ViewStyle;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onValuesChange,
  quantidadePorLinha = 3,
  style,
}) => {
  const handleToggle = (option: string) => {
    if (selectedValues.includes(option)) {
      onValuesChange(selectedValues.filter((value) => value !== option));
    } else {
      onValuesChange([...selectedValues, option]);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, { width: `${100 / quantidadePorLinha}%` }]}
            onPress={() => handleToggle(option)}
            activeOpacity={0.7}
          >
            <Feather
              name={selectedValues.includes(option) ? 'check-square' : 'square'}
              size={24}
              color={selectedValues.includes(option) ? '#FFA500' : '#757575'}
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
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#434343',
  },
});

export default CheckboxGroup;
