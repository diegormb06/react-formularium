## React formularium

O *React formularium* é uma biblioteca em desenvolvimento e tem a proposta de ser uma lib simples para gestão de formulários que faz uso das estrutura de dados nativas do javascript para salvar, atualizar e obter dados. O core dessa lib é  usar um Map do javascript como estrutura que armazena os dados do formulário e fornece toda api necessária para obter o valor de um campo, alterá-lo e deletá-lo, sem nenhum grande processamento ou uso de estrutura do react, apenas usando map. 

Sendo assim para salvar o dado do formulário você poderia fazer o seguinte:
```
const {data: formData} = useForm<Type of data>(initialdataObj);

<TextInput
  name="title"
  placeholder="Digite o titulo do anuncio"
  onChangeText={value => formData.set('title', value)}
/>
```

Para obter o dado:
```
const title = formData.get(title)
```
A função *submitForm* passa todos os dados por parâmetro e recebe um objeto para fazer as validações básicas.
```
const onSubmit = async (formData: T) => {
  console.log(formData) // log an object with all form data
}

submitForm(onSubmit, rules)
```
