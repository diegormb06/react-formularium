import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type FormContextType = {
  formData: Map<string, any>;
};

export const FormContext = createContext<FormContextType>({} as FormContextType);

type FormProviderProps = {
  children: React.ReactNode;
};

export const FormProvider = ({ children }: FormProviderProps) => {
  const formData = useMemo(() => new Map(), []);

  return <FormContext.Provider value={{ formData }}>{children}</FormContext.Provider>;
};

export function useFormContext() {
  return useContext(FormContext);
}
