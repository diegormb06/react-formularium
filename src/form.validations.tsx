export interface StandardSchemaIssue {
  readonly message: string;
  readonly path?: ReadonlyArray<PropertyKey | { readonly key: PropertyKey }>;
}

export type StandardSchemaResult<Output> =
  | { readonly value: Output; readonly issues?: undefined }
  | { readonly value?: undefined; readonly issues: ReadonlyArray<StandardSchemaIssue> };

export interface StandardSchema<Input = unknown, Output = Input> {
  readonly '~standard': {
    readonly version: 1;
    readonly vendor: string;
    validate(
      value: unknown
    ): StandardSchemaResult<Output> | Promise<StandardSchemaResult<Output>>;
    readonly types?: {
      readonly input: Input;
      readonly output: Output;
    };
  };
}

export interface UseFormConfig<T extends Record<string, any> = Record<string, any>> {
  initialValues?: Partial<T>;
  schema?: StandardSchema<unknown, T>;
}

export function mapIssues<T extends Record<string, any>>(
  issues: ReadonlyArray<StandardSchemaIssue>
): Partial<Record<keyof T, string>> {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const key = issue.path?.map(p => (p !== null && typeof p === 'object' ? String(p.key) : String(p))).join('.');
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }

  return errors as Partial<Record<keyof T, string>>;
}
