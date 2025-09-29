import { useContext, useState, useEffect, useCallback, useRef } from "react";
import { FormSchema, validateFields } from "./form.validations";
import { FormContext } from "./form.context";

/**
 * `useForm` hook for managing form state, validation, and submission.
 *
 * This hook provides a comprehensive solution for handling form interactions,
 * including state management, validation against a schema, and submission handling.
 * It leverages React's context API for state management and provides methods
 * for setting values, retrieving form data, validating the form, and submitting the form.
 *
 * @example
 * ```tsx
 * const { getValues, setValue, submitForm, formErrors } = useForm({
 *   name: { required: true, type: 'string' },
 *   email: { required: true, type: 'email' }
 * });
 *
 * const handleSubmit = async (values: { name: string, email: string }) => {
 *   // Handle form submission
 *   console.log(values);
 * };
 *
 * return (
 *   <form onSubmit={(e) => {
 *     e.preventDefault();
 *     submitForm(handleSubmit);
 *   }}>
 *     <input
 *       type="text"
 *       name="name"
 *       value={getValues().name || ''}
 *       onChange={(e) => setValue('name', e.target.value)}
 *     />
 *     {formErrors.name && <span>{formErrors.name}</span>}
 *
 *     <input
 *       type="email"
 *       name="email"
 *       value={getValues().email || ''}
 *       onChange={(e) => setValue('email', e.target.value)}
 *     />
 *      {formErrors.email && <span>{formErrors.email}</span>}
 *
 *     <button type="submit">Submit</button>
 *   </form>
 * );
 * ```
 */
export function useForm<T extends Record<string, any> = Record<string, any>>(
  formSchema?: FormSchema | null, 
  initialData?: Partial<T>
) {
  const { formData } = useContext(FormContext);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof T, string>>>({});
  const initialDataRef = useRef<Partial<T> | undefined>(initialData);
  const hasInitialized = useRef(false);

  // Initialize form data with initial values only once
  useEffect(() => {
    if (!hasInitialized.current && initialDataRef.current && Object.keys(initialDataRef.current).length > 0) {
      for (const [key, value] of Object.entries(initialDataRef.current)) {
        if (value !== undefined) {
          formData.set(key, value);
        }
      }
      hasInitialized.current = true;
    }
  }, [formData]);

  // Event listener para prevenir submit padrão
  useEffect(() => {
    const controller = new AbortController();
    const handleSubmit = (e: Event) => e.preventDefault();
    
    document.addEventListener("submit", handleSubmit, { 
      signal: controller.signal,
      capture: true 
    });

    return () => {
      controller.abort();
    };
  }, []);

  /**
   * getValues - Parse form data from Map to object
   * Memoized to avoid recreating object on every render
   */
  const getValues = useCallback((): T => {
    return Object.fromEntries(formData) as T;
  }, [formData]);

  /**
   * formValidator - Perform validations according to the provided schema
   * Now properly memoized with correct dependencies
   */
  const formValidator = useCallback((rules: FormSchema) => {
    const currentValues = getValues();
    const errors = validateFields(rules, currentValues);
    return errors;
  }, [getValues]);

  /**
   * setValue - Helper method to update individual form values
   * Provides a controlled way to update form data
   */
  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    formData.set(key as string, value);
  }, [formData]);

  /**
   * clearErrors - Helper method to clear form errors
   */
  const clearErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  /**
   * submitForm - Handle form submission with optional validation
   * Now with improved error handling and type safety
   */
  const submitForm = useCallback((onSubmit: (values: T) => void | Promise<void>) => {
    if (formSchema) {
      const { hasError, ...errors } = formValidator(formSchema);

      if (hasError) {
        setFormErrors(errors as Partial<Record<keyof T, string>>);
        return;
      }
      
      // Clear errors on successful validation
      setFormErrors({});
    }

    const values = getValues();
    onSubmit(values);
  }, [formSchema, formValidator, getValues]);

  return { 
    getValues, 
    setValue,
    formData, 
    formErrors, 
    submitForm,
    clearErrors
  };
}
