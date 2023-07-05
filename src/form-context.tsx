import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FormSchema, validateFields } from "./validations";

type FormContextType = {
  formData: Map<string, any>;
  formErrors: any;
  submitForm: (onSubmit: () => void) => void;
  clearFormData: () => void;
  setSchema: (formSchema: FormSchema) => void;
};

const FormContext = createContext<FormContextType>({} as FormContextType);

type FormProviderProps = {
  children: React.ReactNode;
};

export const FormProvider = ({ children }: FormProviderProps) => {
  const [formErrors, setFormErrors] = useState<any>({});
  const formData = useMemo(() => new Map(), []);
  let schema: FormSchema;

  const setSchema = useCallback((formSchema: FormSchema) => {
    schema = formSchema;
  }, []);

  const clearFormData = useCallback(() => {
    formData.clear();
  }, [formData]);

  const formValidator = useCallback((rules: FormSchema) => {
    const inputData = Object.fromEntries(formData);
    const errors = validateFields(rules, inputData);
    setFormErrors(errors);
    return errors.hasError;
  }, []);

  const submitForm = useCallback(
    (onSubmit: () => void) => {
      if (formValidator(schema)) {
        return;
      }

      return () => onSubmit();
    },
    [formValidator]
  );

  return (
    <FormContext.Provider value={{ setSchema, formData, formErrors, submitForm, clearFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export function useForm<T = any>(formSchema: FormSchema, initialData?: T) {
  const { formData, setSchema, ...contextData } = useContext(FormContext);

  if (initialData && Object.keys(initialData).length) {
    setSchema(formSchema);
    for (const [key, value] of Object.entries(initialData)) {
      formData.set(key, value);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const body = document.querySelector("body");
    body?.addEventListener("submit", (e) => e.preventDefault(), { signal: controller.signal });

    return () => {
      controller.abort();
      formData.clear();
    };
  }, [formData]);

  const getValues = () => Object.fromEntries(formData) as T;

  return { getValues, formData, ...contextData };
}
