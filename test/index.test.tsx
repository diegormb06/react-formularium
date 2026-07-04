import { describe, test, expect } from "vitest";
import * as FormModule from "../src/index";

describe("index file", () => {
  test("should export FormContext", () => {
    expect(FormModule.FormContext).toBeDefined();
  });

  test("should export useForm", () => {
    expect(FormModule.useForm).toBeDefined();
  });

  test("should export mapIssues", () => {
    expect(FormModule.mapIssues).toBeDefined();
  });
});
