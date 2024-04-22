import { describe, test, expect } from "vitest";
import * as FormModule from "../src/index"; // Importe o módulo index.ts

describe("index file", () => {
  test("should export FormContext", () => {
    expect(FormModule.FormContext).toBeDefined();
  });

  test("should export useForm", () => {
    expect(FormModule.useForm).toBeDefined();
  });

  test("should export validateFields", () => {
    expect(FormModule.validateFields).toBeDefined();
  });
});
