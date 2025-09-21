import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface InputProps {
  name: string;
  placeholder: string;
  required?: boolean;
  inputType: 'text' | 'password' | 'email' | 'number' | 'address' | 'phone';
  error?: string | null;
  secureTextEntry?: boolean;
  placeholderTextColor?: string;
  maxLength?: number;
  minLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: object;
  value?: string;
  onChangeText?: (value: string) => void;
  mask?: (value: string) => string;
  customValidator?: (value: string | string[]) => string | null;
}

export default function InputText({
  inputType,
  placeholder,
  maxLength,
  error,
  style,
  value,
  placeholderTextColor,
  secureTextEntry = false,
  onChangeText,
  mask,
}: InputProps) {
  const getKeyboardType = (): KeyboardTypeOptions => {
    switch (inputType) {
      case 'email':
        return 'email-address';
      case 'number':
        return 'number-pad';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  const handleTextChange = (text: string) => {
    if (!onChangeText) return;

    const formattedText = mask ? mask(text) : text;
    onChangeText(formattedText);
  };

  return (
    <View style={defaultStylesInput.container}>
      <TextInput
        style={[defaultStylesInput.input, style]}
        keyboardType={getKeyboardType()}
        secureTextEntry={inputType === 'password' ? true : secureTextEntry}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength || 100}
        onChangeText={handleTextChange}
        placeholderTextColor={placeholderTextColor || '#BDBDBD'}
        autoCapitalize={
          ['email', 'password'].includes(inputType) ? 'none' : 'sentences'
        }
      />
      {error ? <Text style={defaultStylesInput.errorText}>{error}</Text> : null}
    </View>
  );
}

const defaultStylesInput = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#434343',
  },
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    fontWeight: '600',
  },
});
