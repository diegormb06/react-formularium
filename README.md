<div align="center">
  <img width="100%" src="https://github.com/diegormb06/react-formularium/assets/22642060/246bff25-553e-4ccc-b52c-0042da827ef0">
</div>

<div align="center">
  <img src="https://github.com/diegormb06/react-formularium/actions/workflows/main.yml/badge.svg"/> 
  <a href="https://codecov.io/github/diegormb06/react-formularium"> 
   <img src="https://codecov.io/github/diegormb06/react-formularium/graph/badge.svg?token=WL35XR8QTN"/> 
  </a>
</div>

## React formularium

The *React Formularium* is a library under development that aims to be a simple and efficient solution for form management. It stands out for using native JavaScript data structures to save, update, and retrieve data, making it lightweight and performant.

### Key Features:

* **Simplicity:** The library offers an intuitive and easy-to-use API, ideal for beginners and experienced developers.
* **Efficiency:** The use of native JavaScript data structures ensures superior performance and optimizes resource usage.
* **Flexibility:** React Formularium is compatible with different types of forms and can be easily integrated into other projects.
* **Extensibility:** The library provides customizable hooks that allow you to adapt the form's behavior to your specific needs.

<br/>

Therefore, to save the form data, you could do the following:
```javascript
const { data: formData } = useForm<Type of data>(initialdataObj);

<TextInput
  name="title"
  placeholder="Digite o titulo do anuncio"
  onChangeText={value => formData.set('title', value)}
/>
```
<br/>

To get individual data:
```javascript
const title = formData.get(title)
```
<br/>

The function *submitForm* return all data as parameter to the callback function.
```typescript
const onSubmit = async (formData: T) => {
  console.log(formData) // log an object with all form data
}

submitForm(onSubmit, rules)
```
