import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FormSchema, validateFields } from "./validations";

type FormContextType = {
  formData: any;
  formErrors: any;
  handleFormData: (name: string, value: any) => void;
  submitForm: (onSubmit: any, rules: FormSchema) => void;
  clearFormData: () => void;
  setValue: (key: string, value: any) => void;
};

type FormProviderProps = {
  children: React.ReactNode;
};

export const FormContext = createContext<FormContextType>({} as FormContextType);

export const FormProvider = ({ children }: FormProviderProps) => {
  const [formErrors, setFormErrors] = useState<any>({});
  const formData = useMemo(() => new Map(), []);

  const handleFormData = useCallback(
    (name: string, value: any) => {
      formData.set(name, value);
    },
    [formData]
  );

  const clearFormData = useCallback(() => {
    formData.clear();
  }, [formData]);

  const setValue = (key: string, value: any) => {
    formData.set(key, value);
  };

  const formValidator = useCallback(
    (rules: FormSchema) => {
      const inputData = Object.fromEntries(formData);
      const errors = validateFields(rules, inputData);
      setFormErrors(errors);
      return errors.hasError;
    },
    [formData]
  );

  const submitForm = useCallback(
    (onSubmit: any, rules: FormSchema) => {
      if (formValidator(rules)) {
        return;
      }
      const formValues = Object.fromEntries(formData);
      onSubmit(formValues);
    },
    [formData, formValidator]
  );

  return (
    <FormContext.Provider value={{ handleFormData, formData, formErrors, setValue, submitForm, clearFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export function useForm<T = any>(initialData?: T) {
  const { formData, ...contextData } = useContext(FormContext);

  if (initialData && Object.keys(initialData).length) {
    formData.clear();
    for (const [key, value] of Object.entries(initialData)) {
      formData.set(key, value);
    }
  }

  useEffect(() => {
    return () => formData.clear();
  }, [formData]);

  const data = formData as T;
  return { data, ...contextData };
}

export const useFormData = () => {
  const { formData, handleFormData, formErrors } = useContext(FormContext);
  const data = Object.fromEntries(formData);
  return { data, formErrors, handleFormData };
};
