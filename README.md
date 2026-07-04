<div align="center">
  <img src="https://github.com/diegormb06/react-formularium/actions/workflows/main.yml/badge.svg"/> 
  <a href="https://codecov.io/github/diegormb06/react-formularium"> 
   <img src="https://codecov.io/github/diegormb06/react-formularium/graph/badge.svg?token=WL35XR8QTN"/> 
  </a>
</div>

# 🚀 React Formularium

A simple, efficient, and performant library for form management in React. **React Formularium** uses native JavaScript structures (Map) to save, update, and retrieve data, providing a lightweight and optimized solution.

**Works perfectly on both React Native and web**, with or without frameworks like **Next.js**, **Expo**, **Vite**, or any other React environment. The library is platform-agnostic, ensuring the same API and functionality across all environments.

## ✨ Key Features

* 🎯 **Simplicity**: Intuitive and easy-to-use API, ideal for beginners and experienced developers
* ⚡ **Performance**: Uses native JavaScript data structures to optimize resource usage
* 🔧 **Flexibility**: Compatible with different types of forms and easy integration
* 🛠️ **TypeScript**: Complete TypeScript support with strong typing and schema-inferred types
* ✅ **Standard Schema**: Validation via the [Standard Schema](https://standardschema.dev) spec — use Zod, Valibot, ArkType, or any compatible library without adapters
* 📱 **Multiplatform**: Works on React Web, React Native, Next.js, Expo, and other frameworks

## 📚 Table of Contents

- [📦 Installation](#-installation)
- [🌐 Multiplatform Compatibility](#-multiplatform-compatibility)
- [🚀 Quick Start](#-quick-start)
- [📖 Complete API](#-complete-api)
- [🔧 Practical Examples](#-practical-examples)
  - [Form with Initial Data](#form-with-initial-data)
  - [Form with Validation (Standard Schema)](#form-with-validation-standard-schema)
  - [React Native Example](#react-native-example)
  - [Dynamic Form](#dynamic-form)
- [✅ Standard Schema Validation](#-standard-schema-validation)
- [🎨 Integration with UI Libraries](#-integration-with-ui-libraries)
- [🔄 Advanced Use Cases](#-advanced-use-cases)
- [📊 Performance and Best Practices](#-performance-and-best-practices)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🔗 Useful Links](#-useful-links)

## 📦 Installation

```bash
npm install react-formularium
# or
yarn add react-formularium
# or
pnpm add react-formularium
```

## 🌐 Multiplatform Compatibility

React Formularium was designed to work identically across all React platforms:

| Platform | Status | Notes |
|----------|--------|-------|
| ⚛️ **React Web** | ✅ Full support | Works with Vite, Create React App, Webpack |
| 📱 **React Native** | ✅ Full support | iOS, Android, Expo Go |
| 🔄 **Next.js** | ✅ Full support | SSR, SSG, App Router, Pages Router |
| 🚀 **Expo** | ✅ Full support | Managed and Bare workflow |
| ⚡ **Vite** | ✅ Full support | Optimized build |

**The same API works in all environments!** You can use exactly the same code between web and mobile projects.

## 🚀 Quick Start

### 1. Setup the Provider

First, wrap your application with the `FormProvider`:

```tsx
import { FormProvider } from 'react-formularium';

function App() {
  return (
    <FormProvider>
      <YourFormComponent />
    </FormProvider>
  );
}
```

### 2. Basic Usage

```tsx
import { useForm } from 'react-formularium';

interface FormData {
  name: string;
  email: string;
  age: number;
}

function MyForm() {
  const { getValues, setValue, submitForm, formErrors } = useForm<FormData>();

  const handleSubmit = async (values: FormData) => {
    console.log('Form data:', values);
    // Send data to API, etc.
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      submitForm(handleSubmit);
    }}>
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setValue('name', e.target.value)}
      />
      
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setValue('email', e.target.value)}
      />
      
      <input
        type="number"
        placeholder="Age"
        onChange={(e) => setValue('age', parseInt(e.target.value))}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 📖 Complete API

### `useForm<T>(config?)`

The main hook of the library that returns an object with form methods and state.

#### Config object

```typescript
{
  initialValues?: Partial<T>;          // Initial values to populate the form
  schema?: StandardSchema<unknown, T>  // Any Standard Schema compatible library
}
```

#### Returns

```typescript
{
  getValues: () => T;                            // Gets all form values
  setValue: (key, value) => void;                // Sets a specific value
  formData: Map<string, any>;                    // Direct access to the data Map
  formErrors: Partial<Record<keyof T, string>>;  // Validation errors per field
  submitForm: (callback) => Promise<void>;       // Submits the form (async)
  clearErrors: () => void;                       // Clears all errors
}
```

## 🔧 Practical Examples

### Form with Initial Data

```tsx
interface UserForm {
  name: string;
  email: string;
  bio: string;
}

function EditUserForm() {
  const { getValues, setValue, submitForm } = useForm<UserForm>({
    initialValues: {
      name: 'John Silva',
      email: 'john@example.com',
      bio: 'React passionate developer'
    }
  });

  const handleSubmit = async (values: UserForm) => {
    try {
      await updateUser(values);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const currentValues = getValues();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      submitForm(handleSubmit);
    }}>
      <input
        type="text"
        value={currentValues.name || ''}
        onChange={(e) => setValue('name', e.target.value)}
        placeholder="Full name"
      />
      
      <input
        type="email"
        value={currentValues.email || ''}
        onChange={(e) => setValue('email', e.target.value)}
        placeholder="Your email"
      />
      
      <textarea
        value={currentValues.bio || ''}
        onChange={(e) => setValue('bio', e.target.value)}
        placeholder="Your biography"
        rows={4}
      />
      
      <button type="submit">Save Changes</button>
    </form>
  );
}
```

### Form with Validation (Standard Schema)

Pass any [Standard Schema](https://standardschema.dev)-compatible library via the `schema` option. The example below uses **Zod**, but the same works for Valibot, ArkType, or any other compatible library.

```tsx
import { z } from 'zod';
import { useForm } from 'react-formularium';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const { setValue, submitForm, formErrors, clearErrors, getValues } = useForm<LoginForm>({
    schema: loginSchema,
  });

  const handleSubmit = async (values: LoginForm) => {
    // values is already the validated output from the schema
    const response = await login(values);
    console.log('Login successful:', response);
  };

  const values = getValues();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      submitForm(handleSubmit);
    }}>
      <div>
        <input
          type="email"
          value={values.email || ''}
          onChange={(e) => setValue('email', e.target.value)}
          placeholder="Your email"
        />
        {formErrors.email && <span style={{ color: 'red' }}>{formErrors.email}</span>}
      </div>

      <div>
        <input
          type="password"
          value={values.password || ''}
          onChange={(e) => setValue('password', e.target.value)}
          placeholder="Your password"
        />
        {formErrors.password && <span style={{ color: 'red' }}>{formErrors.password}</span>}
      </div>

      <button type="submit">Sign In</button>
      <button type="button" onClick={clearErrors}>Clear Errors</button>
    </form>
  );
}
```

The same form works identically with **Valibot**:

```tsx
import * as v from 'valibot';

const loginSchema = v.object({
  email: v.pipe(v.string(), v.email('Invalid email')),
  password: v.pipe(v.string(), v.minLength(8, 'Minimum 8 characters')),
});

// useForm({ schema: loginSchema }) — no changes needed
```

### React Native Example

```tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, FormProvider } from 'react-formularium';
import { z } from 'zod';

const mobileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
});

type MobileForm = z.infer<typeof mobileSchema>;

function MobileFormScreen() {
  const { setValue, submitForm, formErrors, getValues } = useForm<MobileForm>({
    schema: mobileSchema,
  });

  const handleSubmit = async (values: MobileForm) => {
    Alert.alert('Success!', `Data sent:\n${JSON.stringify(values, null, 2)}`);
  };

  const values = getValues();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Registration</Text>
      
      <TextInput
        style={[styles.input, formErrors.name && styles.inputError]}
        placeholder="Full name"
        value={values.name || ''}
        onChangeText={(text) => setValue('name', text)}
      />
      {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}

      <TextInput
        style={[styles.input, formErrors.email && styles.inputError]}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={values.email || ''}
        onChangeText={(text) => setValue('email', text)}
      />
      {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}

      <TextInput
        style={[styles.input, formErrors.phone && styles.inputError]}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={values.phone || ''}
        onChangeText={(text) => setValue('phone', text)}
      />
      {formErrors.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={() => submitForm(handleSubmit)}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// In your main App.tsx
function App() {
  return (
    <FormProvider>
      <MobileFormScreen />
    </FormProvider>
  );
}
```

### Dynamic Form

```tsx
function DynamicForm() {
  const { setValue, getValues, submitForm } = useForm();

  const addField = (fieldName: string, fieldValue: any) => {
    setValue(fieldName, fieldValue);
  };

  const handleSubmit = (values: any) => {
    console.log('Dynamic data:', values);
  };

  return (
    <div>
      <button onClick={() => addField('field1', 'Value 1')}>
        Add Field 1
      </button>
      
      <button onClick={() => addField('field2', 42)}>
        Add Field 2
      </button>
      
      <button onClick={() => addField('field3', true)}>
        Add Field 3 (boolean)
      </button>

      <div>
        <h3>Current values:</h3>
        <pre>{JSON.stringify(getValues(), null, 2)}</pre>
      </div>

      <button onClick={() => submitForm(handleSubmit)}>
        Submit Form
      </button>
    </div>
  );
}
```

## ✅ Standard Schema Validation

React Formularium validates using the [Standard Schema](https://standardschema.dev) specification. Any library that implements the spec works without adapters or additional configuration.

### Compatible libraries

| Library | Install |
|---------|---------|
| [Zod](https://zod.dev) | `npm install zod` |
| [Valibot](https://valibot.dev) | `npm install valibot` |
| [ArkType](https://arktype.io) | `npm install arktype` |
| [Effect Schema](https://effect.website/docs/schema) | `npm install effect` |

### How it works

When a `schema` is provided, `submitForm` calls `schema['~standard'].validate(values)` and handles the result:

- **Success** (`{ value }`): errors are cleared, `onSubmit` is called with the validated output
- **Failure** (`{ issues }`): submission is cancelled and `formErrors` is populated

```ts
// What the library does internally — library-agnostic by design
const result = await schema['~standard'].validate(values)

if (result.issues) {
  // map issues to { fieldName: 'first error message' }
  setFormErrors(mapIssues(result.issues))
  return
}

await onSubmit(result.value)
```

Both synchronous and asynchronous `validate()` implementations are supported.

### `mapIssues` utility

The `mapIssues` function is also exported for use outside of `useForm`:

```ts
import { mapIssues } from 'react-formularium';

const errors = mapIssues([
  { message: 'Invalid email', path: ['email'] },
  { message: 'Too short', path: ['password'] },
])
// → { email: 'Invalid email', password: 'Too short' }
```

Nested paths are joined with a dot: `['address', 'street']` → `'address.street'`. Only the first error per field is kept.

## 🎨 Integration with UI Libraries

### With Material-UI

```tsx
import { TextField, Button } from '@mui/material';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

function MaterialUIForm() {
  const { setValue, submitForm, formErrors, getValues } = useForm({ schema });
  const values = getValues();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      submitForm(console.log);
    }}>
      <TextField
        label="Name"
        value={values.name || ''}
        onChange={(e) => setValue('name', e.target.value)}
        error={!!formErrors.name}
        helperText={formErrors.name}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Email"
        type="email"
        value={values.email || ''}
        onChange={(e) => setValue('email', e.target.value)}
        error={!!formErrors.email}
        helperText={formErrors.email}
        fullWidth
        margin="normal"
      />

      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}
```

## 🔄 Advanced Use Cases

### Multi-Step Form

```tsx
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const { setValue, getValues, submitForm } = useForm();

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleFinalSubmit = (values: any) => {
    console.log('Complete form:', values);
  };

  const values = getValues();

  return (
    <div>
      {currentStep === 1 && (
        <div>
          <h2>Step 1: Personal Data</h2>
          <input
            placeholder="Name"
            value={values.name || ''}
            onChange={(e) => setValue('name', e.target.value)}
          />
          <input
            placeholder="Email"
            value={values.email || ''}
            onChange={(e) => setValue('email', e.target.value)}
          />
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h2>Step 2: Address</h2>
          <input
            placeholder="ZIP Code"
            value={values.cep || ''}
            onChange={(e) => setValue('cep', e.target.value)}
          />
          <input
            placeholder="Street"
            value={values.street || ''}
            onChange={(e) => setValue('street', e.target.value)}
          />
          <button onClick={prevStep}>Previous</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h2>Step 3: Confirmation</h2>
          <pre>{JSON.stringify(values, null, 2)}</pre>
          <button onClick={prevStep}>Previous</button>
          <button onClick={() => submitForm(handleFinalSubmit)}>
            Finish
          </button>
        </div>
      )}
    </div>
  );
}
```

## 📊 Performance and Best Practices

### ✅ What to do:

```tsx
// ✅ Use TypeScript types for better experience
interface MyForm {
  name: string;
  email: string;
}

const { setValue } = useForm<MyForm>();

// ✅ Use setValue for controlled updates
setValue('name', 'John');

// ✅ Memoize heavy components if necessary
const MyFormComponent = memo(() => {
  // optimized component
});
```

### ❌ What to avoid:

```tsx
// ❌ Don't modify formData directly
formData.set('field', 'value'); // Avoid this

// ❌ Don't call getValues() in loops or renders
values.map(() => getValues()); // Expensive

// ❌ Don't recreate schemas on every render — declare them outside the component
// Bad:
function MyForm() {
  const schema = z.object({ name: z.string() }); // recreated on every render
  const form = useForm({ schema });
}

// Good:
const schema = z.object({ name: z.string() }); // declared once
function MyForm() {
  const form = useForm({ schema });
}
```

## 🤝 Contributing

Contributions are welcome! Please read our [contribution guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- [Complete Documentation](https://github.com/diegormb06/react-formularium/wiki)
- [Examples](https://github.com/diegormb06/react-formularium/tree/main/examples)
- [Changelog](CHANGELOG.md)
- [Issues](https://github.com/diegormb06/react-formularium/issues)
