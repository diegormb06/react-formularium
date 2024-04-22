import { describe, test, expect } from "vitest";
import { FormSchema, validateFields } from "../src/form.validations";

describe("validateFields function", () => {
  test("should return empty errors object for valid values", () => {
    const rules: FormSchema = {
      cpf: "cpf",
      cnpj: "cnpj",
      email: "email",
      requiredField: "required",
      confirmPassword: "confirm_password",
    };

    const values = {
      cpf: "529.982.247-25",
      cnpj: "21053264000183", //generated in 4dev.com.br
      email: "test@example.com",
      requiredField: "required value",
      confirm_password: "password",
      password: "password",
    };

    const errors = validateFields(rules, values);
    expect(errors.hasError).toEqual(false);
  });

  test("should return errors object for invalid values", () => {
    const rules: FormSchema = {
      cpf: "cpf",
      cnpj: "cnpj",
      email: "email",
      requiredField: "required",
      confirmPassword: "confirm_password",
    };

    const values = {
      cpf: "invalid cpf",
      cnpj: "invalid cnpj",
      email: "invalid email",
      requiredField: "",
      confirm_password: "wrong password",
      password: "password",
    };

    const errors = validateFields(rules, values);

    expect(errors).toEqual({
      cpf: true,
      cnpj: true,
      email: true,
      requiredField: true,
      confirmPassword: true,
      hasError: true,
    });
  });
});
