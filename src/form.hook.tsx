import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { UseFormConfig, mapIssues } from "./form.validations";
import { FormContext } from "./form.context";

export function useForm<T extends Record<string, any> = Record<string, any>>(
  config?: UseFormConfig<T>
) {
  const { formData } = useContext(FormContext);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof T, string>>>({});
  const initialValuesRef = useRef<Partial<T> | undefined>(config?.initialValues);
  const hasInitialized = useRef(false);
  const schemaRef = useRef(config?.schema);

  // Initialize form data with initial values only once
  useEffect(() => {
    if (!hasInitialized.current && initialValuesRef.current && Object.keys(initialValuesRef.current).length > 0) {
      for (const [key, value] of Object.entries(initialValuesRef.current)) {
        if (value !== undefined) {
          formData.set(key, value);
        }
      }
      hasInitialized.current = true;
    }
  }, [formData]);

  // Prevent default form submit
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const controller = new AbortController();
    const handleSubmit = (e: Event) => e.preventDefault();

    document.addEventListener("submit", handleSubmit, {
      signal: controller.signal,
      capture: true,
    });

    return () => {
      controller.abort();
    };
  }, []);

  const getValues = useCallback((): T => {
    return Object.fromEntries(formData) as T;
  }, [formData]);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    formData.set(key as string, value);
  }, [formData]);

  const clearErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  const submitForm = useCallback(async (onSubmit: (values: T) => void | Promise<void>) => {
    const schema = schemaRef.current;

    if (schema) {
      const values = getValues();
      const result = await schema['~standard'].validate(values);

      if (result.issues) {
        setFormErrors(mapIssues<T>(result.issues));
        return;
      }

      setFormErrors({});
      await onSubmit(result.value as T);
      return;
    }

    await onSubmit(getValues());
  }, [getValues]);

  return {
    getValues,
    setValue,
    formData,
    formErrors,
    submitForm,
    clearErrors,
  };
}
