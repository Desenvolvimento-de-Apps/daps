import validateFormField from '@/app/utils/validators';
import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import CheckboxGroup from './CheckboxGroup';
import InputText from './Input';
import RadioGroup from './RadioGroup';
import { AntDesign } from '@expo/vector-icons';

interface FormProps {
  children: ReactNode;
  style?: object;
}

interface TextFieldProps {
  name: string;
  minLength?: number;
  customValidator?: (value: string | string[]) => string | null;
  [key: string]: any;
}

export interface FormHandle {
  formValues: Record<string, string | string[]>;
  fieldErrors: Record<string, string | null>;
  hasErrors: () => boolean;
  setFieldValue: (name: string, value: string | string[]) => void;
  setFieldError: (name: string, error: string | null) => void;
  setFormError: (error: string | null) => void;
}

export const Form = forwardRef<FormHandle, FormProps>(
  ({ children, style }, ref) => {
    const [formValues, setFormValues] = useState<
      Record<string, string | string[]>
    >({});
    const [fieldErrors, setFieldErrors] = useState<
      Record<string, string | null>
    >({});
    const [formErrors, setFormErrors] = useState<string | null>(null);

    const handleInputChange = (
      name: string,
      value: string | string[],
      minLength?: number,
    ) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      const error = handleInputValidation(name, value, minLength);
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };

    const handleInputValidation = (
      name: string,
      value: string | string[],
      minLength?: number,
      customValidator?: (value: string | string[]) => string | null,
    ): string | null => {
      if (customValidator) {
        return customValidator(value);
      }

      return validateFormField(name, value, minLength);
    };

    const setFieldValue = (name: string, value: string | string[]) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    };

    const hasErrors = (): boolean => {
      return Object.values(fieldErrors).some((error) => error !== null) || !!formErrors;
    };

    const setFieldError = (name: string, error: string | null) => {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    };

    const setFormError = (error: string | null) => {
      setFormErrors(error);
    };

    const enhanceChildren = (children: ReactNode): ReactNode => {
      return React.Children.map(children, (child) => {
        if (!React.isValidElement<TextFieldProps>(child)) {
          return child;
        }

        if (child.type === InputText) {
          return React.cloneElement(child, {
            onChangeText: (text: string) =>
              handleInputChange(child.props.name, text, child.props.minLength),
            error: fieldErrors[child.props.name] || null,
            value: formValues[child.props.name] ?? child.props.value,
          });
        }

        if (child.type === CheckboxGroup) {
          return React.cloneElement(child, {
            onValuesChange: (values: string[]) =>
              handleInputChange(
                child.props.name,
                values,
                child.props.onValuesChange,
              ),
            error: fieldErrors[child.props.name] || null,
            selectedValues: Array.isArray(formValues[child.props.name])
              ? formValues[child.props.name]
              : (child.props.selectedValues ?? []),
          });
        }

        if (child.type === RadioGroup) {
          return React.cloneElement(child, {
            onValueChange: (value: string) =>
              handleInputChange(
                child.props.name,
                value,
                child.props.onValueChange,
              ),
            error: fieldErrors[child.props.name] || null,
            selectedValue:
              typeof formValues[child.props.name] === 'string'
                ? formValues[child.props.name]
                : (child.props.selectedValue ?? null),
          });
        }

        if (child.props.children) {
          return React.cloneElement(child, {
            children: enhanceChildren(child.props.children),
          });
        }

        return child;
      });
    };

    useImperativeHandle(ref, () => ({
      formValues,
      fieldErrors,
      setFieldValue,
      hasErrors,
      setFieldError,
      setFormError,
    }));

    return (
      <View style={[style]}>
        {formErrors && (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: '#AD1D00',
              padding: 12,
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <AntDesign name="warning" size={16} color="white" />
            <Text style={{ color: 'white' }}>{formErrors}</Text>
          </View>
        )}
        {enhanceChildren(children)}
      </View>
    );
  },
);

Form.displayName = 'Form';
