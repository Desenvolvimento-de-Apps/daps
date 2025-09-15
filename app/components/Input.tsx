import { KeyboardTypeOptions, StyleSheet, TextInput } from 'react-native';

interface InputType {
  text: string;
  password: string;
  email: string;
  number: number;
  address: string;
  phone: string;
}

interface InputProps {
  placeholder: string;
  inputType: keyof InputType;
  secureTextEntry?: boolean;
  placeholderTextColor?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: object;
  value?: string;
  onChangeText?: (value: string) => void;
}

export default function InputText({
  inputType,
  placeholder,
  style,
  value,
  placeholderTextColor,
  secureTextEntry = false,
  onChangeText,
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
    }

  return (
    <TextInput
      style={[defaultStylesInput.input, style]}
      keyboardType={getKeyboardType()}
      secureTextEntry={inputType === 'password' ? true : secureTextEntry}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={placeholderTextColor || '#BDBDBD'}
      autoCapitalize={['email', 'password'].includes(inputType) ? 'none' : 'sentences'}
    />
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
});
