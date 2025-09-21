import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RadioGroupProps {
  name: string; // Nome do campo, obrigatório para integração com Form
  label?: string;
  options: string[];
  selectedValue?: string | null;
  onValueChange?: (value: string) => void;
  style?: any; // Para suportar estilos personalizados
  error?: string | null; // Para exibir erros de validação
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  selectedValue = null,
  onValueChange,
  style,
  error,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.option}
            onPress={() => onValueChange?.(option)}
            activeOpacity={0.7}
          >
            <Feather
              name={selectedValue === option ? 'check-circle' : 'circle'}
              size={24}
              color={selectedValue === option ? '#FFA500' : '#757575'}
            />
            <Text style={styles.optionText}>{option}</Text>
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default React.memo(RadioGroup);
