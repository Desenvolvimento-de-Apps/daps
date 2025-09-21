import validateFormField from '@/app/utils/validators';
import { AntDesign } from '@expo/vector-icons';
import React, {
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { Text, View } from 'react-native';
import CheckboxGroup from './CheckboxGroup';
import InputText from './Input';
import RadioGroup from './RadioGroup';

interface FormProps<T extends Record<string, string | string[] | null>> {
  children: ReactNode;
  style?: object;
  onSubmit?: (values: T) => Promise<unknown>; // Updated to support async
}

interface FieldProps {
  name: string;
  minLength?: number;
  required?: boolean;
  customValidator?: (value: string | string[] | null) => string | null;
  [key: string]: any;
}

export interface FormHandle<
  T extends Record<string, string | string[] | null>,
> {
  formValues: T;
  fieldErrors: Record<string, string | null>;
  hasErrors: () => boolean;
  getValues: () => T;
  setFieldValue: (name: string, value: string | string[] | null) => void;
  setFieldError: (name: string, error: string | null) => void;
  setFormError: (error: string | null) => void;
  validateAllFields: () => boolean;
  submit: () => Promise<void>; // Updated to return Promise<void>
}

function InnerForm<T extends Record<string, string | string[] | null>>(
  { children, style, onSubmit }: FormProps<T>,
  ref: React.Ref<FormHandle<T>>,
) {
  const [formValues, setFormValues] = useState<T>({} as T);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>(
    {},
  );
  const [formErrors, setFormErrors] = useState<string | null>(null);

  const getValues = useCallback((): T => {
    return formValues;
  }, [formValues]);

  const handleInputChange = useCallback(
    (
      name: string,
      value: string | string[] | null,
      required?: boolean,
      minLength?: number,
      customValidator?: (value: string | string[] | null) => string | null,
    ) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      const error = handleInputValidation(
        name,
        value,
        required,
        minLength,
        customValidator,
      );
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    },
    [],
  );

  const handleInputValidation = useCallback(
    (
      name: string,
      value: string | string[] | null,
      required?: boolean,
      minLength?: number,
      customValidator?: (value: string | string[] | null) => string | null,
    ): string | null => {
      if (required) {
        if (
          value === '' ||
          value === null ||
          (Array.isArray(value) && value.length === 0)
        ) {
          return 'Este campo é obrigatório.';
        }
      }

      if (customValidator) {
        const customError = customValidator(value);
        if (customError) {
          return customError;
        }
      }

      return validateFormField(name, value, minLength);
    },
    [],
  );

  const setFieldValue = useCallback(
    (name: string, value: string | string[] | null) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    },
    [],
  );

  const hasErrors = useCallback((): boolean => {
    return (
      Object.values(fieldErrors).some((error) => error !== null) || !!formErrors
    );
  }, [fieldErrors, formErrors]);

  const setFieldError = useCallback((name: string, error: string | null) => {
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  }, []);

  const setFormError = useCallback((error: string | null) => {
    setFormErrors(error);
  }, []);

  const validateAllFields = useCallback((): boolean => {
    let hasValidationErrors = false;
    const newErrors: Record<string, string | null> = {};

    const validateChildren = (children: ReactNode) => {
      React.Children.forEach(children, (child) => {
        if (!React.isValidElement<FieldProps>(child)) {
          return;
        }

        if (
          child.type === InputText ||
          child.type === CheckboxGroup ||
          child.type === RadioGroup
        ) {
          const { name, required, minLength, customValidator } = child.props;
          const value =
            formValues[name] ?? (child.type === RadioGroup ? null : '');
          const error = handleInputValidation(
            name,
            value,
            required,
            minLength,
            customValidator,
          );
          newErrors[name] = error;
          if (error) {
            hasValidationErrors = true;
          }
        }

        if (child.props.children) {
          validateChildren(child.props.children);
        }
      });
    };

    validateChildren(children);
    setFieldErrors(newErrors);
    return !hasValidationErrors;
  }, [children, formValues, handleInputValidation]);

  const submit = useCallback(async () => {
    setFieldErrors({});
    setFormError(null);
    const hasErros = validateAllFields();

    if (onSubmit && hasErros) {
      Object.values(formValues).forEach((value) => {
        if (typeof value === 'string') {
          value.trim();
        }
      })

      await onSubmit(formValues);
    }
  }, [
    formValues,
    validateAllFields,
    setFieldError,
    setFormError,
    onSubmit,
    hasErrors,
  ]);

  useImperativeHandle(ref, () => ({
    formValues,
    fieldErrors,
    getValues,
    hasErrors,
    setFieldValue,
    setFieldError,
    setFormError,
    validateAllFields,
    submit,
  }));

  const enhanceChildren = useCallback(
    (children: ReactNode): ReactNode => {
      return React.Children.map(children, (child) => {
        if (!React.isValidElement<FieldProps>(child)) {
          return child;
        }

        if (child.type === InputText) {
          return React.cloneElement(child, {
            onChangeText: (text: string) =>
              handleInputChange(
                child.props.name,
                text,
                child.props.required,
                child.props.minLength,
                child.props.customValidator,
              ),
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
                child.props.required,
                child.props.minLength,
                child.props.customValidator,
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
                child.props.required,
                child.props.minLength,
                child.props.customValidator,
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
    },
    [formValues, fieldErrors, handleInputChange],
  );

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
}

export const Form = forwardRef(InnerForm) as <
  T extends Record<string, string | string[] | null>,
>(
  props: FormProps<T> & { ref?: React.Ref<FormHandle<T>> },
) => React.ReactElement;
