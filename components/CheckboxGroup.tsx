import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface CheckboxGroupProps {
  name: string;
  label?: string;
  options: string[];
  selectedValues?: string[];
  onValuesChange?: (values: string[]) => void;
  quantidadePorLinha?: number;
  style?: ViewStyle;
  error?: string | null;
  disabled?: boolean;
  singleSelection?: boolean;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  label,
  options,
  selectedValues = [],
  onValuesChange,
  quantidadePorLinha = 3,
  style,
  error,
  disabled = false,
  singleSelection = false,
}) => {
  const handleToggle = (option: string) => {
    let newValues: string[];

    if (singleSelection) {
      newValues = selectedValues.includes(option) ? [] : [option];
    } else {
      newValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
    }
    onValuesChange?.(newValues);
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, { width: `${100 / quantidadePorLinha}%` }]}
            onPress={() => handleToggle(option)}
            activeOpacity={0.7}
            disabled={disabled}
          >
            <Feather
              name={selectedValues.includes(option) ? 'check-square' : 'square'}
              size={24}
              color={selectedValues.includes(option) ? '#FFA500' : '#757575'}
            />
            <Text style={[styles.optionText, disabled && styles.disabledText]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  disabledText: {
    opacity: 0.3,
  },
});

export default CheckboxGroup;
