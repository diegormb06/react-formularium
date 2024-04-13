import { useContext, useState, useEffect, useCallback } from "react";
import { FormSchema, validateFields } from "./form.validations";
import { FormContext } from "./form.context";

export function useForm<T = any>(formSchema?: FormSchema | null, initialData?: T) {
  const { formData } = useContext(FormContext);
  const [formErrors, setFormErrors] = useState<any>({});

  useEffect(() => {
    const controller = new AbortController();
    const body = document.querySelector("body");
    body?.addEventListener("submit", (e) => e.preventDefault(), { signal: controller.signal });

    return () => {
      controller.abort();
      formData.clear();
    };
  }, [formData]);

  if (initialData && Object.keys(initialData).length) {
    for (const [key, value] of Object.entries(initialData)) {
      formData.set(key, value);
    }
  }

  /**
   *  *formValidator* perform a simple validations according to the provided
   *  schema. The schema could be required, isTrue, email, brazilian cpf and cnpj ids
   *  and confirm_password.
   *
   * @param {FormSchema} rules schema with validation rules
   */
  const formValidator = useCallback((rules: FormSchema) => {
    const inputData = Object.fromEntries(formData);
    const errors = validateFields(rules, inputData);
    setFormErrors(errors);

    return errors.hasError;
  }, []);

  /**
   *  *submitForm* can call two functions. If a schema is provided
   *  its calls the validation function and if has a validation error them onSubmit is not called,
   *  if not its calls onSubmit
   *  without validate de fields.
   *
   *  @param onSubmit callback triggered when form is submitted
   */
  const submitForm = useCallback((onSubmit: () => void) => {
    if (formSchema) {
      const { hasError } = formValidator(formSchema);

      if (hasError) {
        return;
      }
    }

    onSubmit();
  }, []);

  /**
   *  *getValues* just parse the form data from Map to object
   *
   * @returns formData in object format
   */
  const getValues = () => Object.fromEntries(formData) as T;

  return { getValues, formData, formErrors, submitForm };
}
