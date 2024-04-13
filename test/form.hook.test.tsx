import React from "react";
import { describe, test, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useForm } from "../src/form.hook";
import { FormProvider } from "../src/form.context";
import { FormSchema } from "../src/form.validations";

const props = {
  formSchema: {
    email: "email",
    password: "required",
  } satisfies FormSchema,
  initialData: {
    email: "test@example.com",
    password: "123456",
  },
};

function renderUseFormHook(schema?: FormSchema | null, initialData?: any) {
  const wrapper = ({ children }) => <FormProvider>{children}</FormProvider>;
  const { result } = renderHook(() => useForm(schema, initialData), {
    wrapper,
  });
  return result.current;
}

describe("useForm hook", () => {
  test("getValues returns initial data when provided", () => {
    const useForm = renderUseFormHook(null, props.initialData);

    expect(useForm.getValues()).toEqual(props.initialData);
  });

  test("getValues returns empty object when no initial data provided", () => {
    const useForm = renderUseFormHook(null);

    expect(useForm.getValues()).toEqual({});
  });

  test("submitForm calls onSubmit when no schema provided", () => {
    const onSubmit = vi.fn();
    const useForm = renderUseFormHook(null);

    act(() => {
      useForm.submitForm(onSubmit);
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  test("submitForm calls onSubmit when schema provided and no errors", () => {
    const onSubmit = vi.fn();
    const useForm = renderUseFormHook(props.formSchema, { email: "diego@example.com", password: "123" });

    act(() => {
      useForm.submitForm(onSubmit);
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  test("submitForm does not call onSubmit when schema provided and has errors", () => {
    const onSubmit = vi.fn();
    const useForm = renderUseFormHook(props.formSchema, { email: "...", password: "123" });

    act(() => {
      useForm.submitForm(onSubmit);
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
