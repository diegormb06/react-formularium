import { describe, test, expect } from "vitest";
import { mapIssues } from "../src/form.validations";

describe("mapIssues", () => {
  test("maps issues array to { field: message } object", () => {
    const result = mapIssues([
      { message: "Invalid email", path: ["email"] },
      { message: "Minimum length is 8", path: ["password"] },
    ]);

    expect(result).toEqual({
      email: "Invalid email",
      password: "Minimum length is 8",
    });
  });

  test("keeps only the first error per field", () => {
    const result = mapIssues([
      { message: "First error", path: ["email"] },
      { message: "Second error", path: ["email"] },
    ]);

    expect(result).toEqual({ email: "First error" });
  });

  test("ignores issues without path", () => {
    const result = mapIssues([{ message: "Global error" }]);

    expect(result).toEqual({});
  });

  test("supports nested paths with dot notation", () => {
    const result = mapIssues([
      { message: "Required", path: ["address", "street"] },
    ]);

    expect(result).toEqual({ "address.street": "Required" });
  });

  test("returns empty object when issues array is empty", () => {
    const result = mapIssues([]);

    expect(result).toEqual({});
  });

  test("supports StandardPathItem ({ key }) style path entries", () => {
    const result = mapIssues([
      { message: "Invalid email", path: [{ key: "email" }] },
      { message: "Required", path: [{ key: "address" }, { key: "street" }] },
    ]);

    expect(result).toEqual({
      email: "Invalid email",
      "address.street": "Required",
    });
  });

  test("supports mixed primitive and StandardPathItem path entries", () => {
    const result = mapIssues([
      { message: "Out of range", path: ["items", { key: 0 }, "value"] },
    ]);

    expect(result).toEqual({ "items.0.value": "Out of range" });
  });
});
