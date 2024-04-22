export type RulesOptions = "cpf" | "cnpj" | "email" | "required" | "toBeTrue" | "confirm_password";
export type FormSchema = { [key: string]: RulesOptions };

function cnpjValidation(value: string) {
  if (!value) {
    return true;
  }

  // Aceita receber o valor como string, número ou array com todos os dígitos
  const validTypes = typeof value === "string" || Number.isInteger(value) || Array.isArray(value);

  // Elimina valor em formato inválido
  if (!validTypes) {
    return true;
  }

  // Guarda um array com todos os dígitos do valor
  const match = value.toString().match(/\d/g);
  const numbers = Array.isArray(match) ? match.map(Number) : [];

  // Valida a quantidade de dígitos
  if (numbers.length !== 14) {
    return true;
  }

  // Elimina inválidos com todos os dígitos iguais
  const items = [...new Set(numbers)];
  if (items.length === 1) {
    return true;
  }

  // Cálculo validador
  const calc = (x: number) => {
    const slice = numbers.slice(0, x);
    let factor = x - 7;
    let sum = 0;

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i];
      sum += n * factor--;
      if (factor < 2) {
        factor = 9;
      }
    }

    const result = 11 - (sum % 11);

    return result > 9 ? 0 : result;
  };

  // Separa os 2 últimos dígitos de verificadores
  const digits = numbers.slice(12);

  // Valida 1o. dígito verificador
  const digit0 = calc(12);
  if (digit0 !== digits[0]) {
    return true;
  }

  // Valida 2o. dígito verificador
  const digit1 = calc(13);
  return digit1 === digits[1] ? false : true;
}

function validarCPF(strCPF: string = "") {
  strCPF = strCPF.replace(/[^\d]+/g, "");
  if (strCPF === undefined) {
    return true;
  }

  var Soma;
  var Resto;
  Soma = 0;
  if (strCPF === "00000000000") {
    return !false;
  }

  for (let i = 1; i <= 9; i++) {
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  }
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }
  if (Resto !== parseInt(strCPF.substring(9, 10))) {
    return !false;
  }

  Soma = 0;
  for (let i = 1; i <= 10; i++) {
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  }
  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }
  if (Resto !== parseInt(strCPF.substring(10, 11))) {
    return !false;
  }
  return false;
}

function isRequired(value: string | undefined) {
  if (value?.length === 0 || value === undefined) {
    return true;
  }

  return false;
}

function testEmail(email: string) {
  return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}

function toBeTrue(value: any) {
  return !!value === false;
}

export function validateFields(rules: FormSchema, values: any) {
  let errors: any = {};

  for (let rule in rules) {
    switch (rules[rule]) {
      case "cpf":
        errors[rule] = validarCPF(values.cpf);
        break;
      case "cnpj":
        errors[rule] = cnpjValidation(values.cnpj);
        break;
      case "email":
        errors[rule] = testEmail(values.email);
        break;
      case "required":
        errors[rule] = isRequired(values[rule]);
        break;
      case "toBeTrue":
        errors[rule] = toBeTrue(values[rule]);
        break;
      case "confirm_password":
        errors[rule] = values.password !== values.confirm_password;
        break;
      default:
        errors[rule] = toBeTrue(values[rule]);
        break;
    }
  }

  if (Object.values(errors).indexOf(true) > -1) {
    errors.hasError = true;
  } else {
    errors.hasError = false;
  }

  return errors;
}
