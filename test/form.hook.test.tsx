import React from "react";
import { describe, test, expect, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useForm } from "../src/form.hook";
import { FormProvider } from "../src/form.context";
import { StandardSchema } from "../src/form.validations";

function makeSchema(result: object): StandardSchema {
  return {
    '~standard': {
      version: 1,
      vendor: 'test',
      validate: () => result as any,
    },
  };
}

function makeAsyncSchema(result: object): StandardSchema {
  return {
    '~standard': {
      version: 1,
      vendor: 'test',
      validate: () => Promise.resolve(result as any),
    },
  };
}

function renderUseFormHook(config?: Parameters<typeof useForm>[0]) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FormProvider>{children}</FormProvider>
  );
  const { result } = renderHook(() => useForm(config), { wrapper });
  return result;
}

describe("useForm hook", () => {
  test("getValues returns initialValues when provided", () => {
    const initialValues = { email: "test@example.com", password: "123456" };
    const hook = renderUseFormHook({ initialValues });

    expect(hook.current.getValues()).toEqual(initialValues);
  });

  test("getValues returns empty object when no initialValues provided", () => {
    const hook = renderUseFormHook();

    expect(hook.current.getValues()).toEqual({});
  });

  test("submitForm calls onSubmit when no schema provided", async () => {
    const onSubmit = vi.fn();
    const hook = renderUseFormHook();

    await act(async () => {
      await hook.current.submitForm(onSubmit);
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  test("submitForm calls onSubmit with validated value when schema is valid", async () => {
    const validatedValue = { email: "user@example.com", password: "secret" };
    const schema = makeSchema({ value: validatedValue });
    const onSubmit = vi.fn();
    const hook = renderUseFormHook({ schema });

    await act(async () => {
      await hook.current.submitForm(onSubmit);
    });

    expect(onSubmit).toHaveBeenCalledWith(validatedValue);
  });

  test("submitForm does not call onSubmit when schema returns issues", async () => {
    const schema = makeSchema({
      issues: [{ message: "Invalid email", path: ["email"] }],
    });
    const onSubmit = vi.fn();
    const hook = renderUseFormHook({ schema });

    await act(async () => {
      await hook.current.submitForm(onSubmit);
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("submitForm populates formErrors when schema returns issues", async () => {
    const schema = makeSchema({
      issues: [
        { message: "Invalid email", path: ["email"] },
        { message: "Too short", path: ["password"] },
      ],
    });
    const hook = renderUseFormHook({ schema });

    await act(async () => {
      await hook.current.submitForm(vi.fn());
    });

    expect(hook.current.formErrors).toEqual({
      email: "Invalid email",
      password: "Too short",
    });
  });

  test("submitForm clears formErrors when schema is valid", async () => {
    const invalidSchema = makeSchema({
      issues: [{ message: "Required", path: ["email"] }],
    });
    const hook = renderUseFormHook({ schema: invalidSchema });

    await act(async () => {
      await hook.current.submitForm(vi.fn());
    });

    expect(hook.current.formErrors).toEqual({ email: "Required" });

    const validatedValue = { email: "ok@example.com" };
    const validSchema = makeSchema({ value: validatedValue });

    const hookValid = renderUseFormHook({ schema: validSchema });

    await act(async () => {
      await hookValid.current.submitForm(vi.fn());
    });

    expect(hookValid.current.formErrors).toEqual({});
  });

  test("submitForm supports async schema validate", async () => {
    const validatedValue = { email: "async@example.com" };
    const schema = makeAsyncSchema({ value: validatedValue });
    const onSubmit = vi.fn();
    const hook = renderUseFormHook({ schema });

    await act(async () => {
      await hook.current.submitForm(onSubmit);
    });

    expect(onSubmit).toHaveBeenCalledWith(validatedValue);
  });
});

