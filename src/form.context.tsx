import React from "react";

type FormContextType = {
  formData: Map<string, any>;
};

export const FormContext = React.createContext<FormContextType>({} as FormContextType);

type FormProviderProps = {
  children: React.ReactNode;
};

export const FormProvider = ({ children }: FormProviderProps) => {
  const formData = React.useMemo(() => new Map(), []);

  return <FormContext.Provider value={{ formData }}>{children}</FormContext.Provider>;
};

export function useFormContext() {
  return React.useContext(FormContext);
}
