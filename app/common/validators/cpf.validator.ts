import Joi from "joi";

export function cpfBR() {
  return Joi.string()
    .custom((value, helpers) => {
      if (typeof value !== "string") return helpers.error("string.base");

      // Remove qualquer caractere que não seja número
      const digits = value.replace(/\D/g, "");

      // Deve ter 11 dígitos
      if (digits.length !== 11) {
        return helpers.error("string.cpf", {
          message: "CPF deve ter 11 dígitos.",
        });
      }

      // Verifica se todos os dígitos são iguais (inválido)
      if (/^(\d)\1{10}$/.test(digits)) {
        return helpers.error("string.cpf", {
          message: "CPF inválido (todos dígitos iguais).",
        });
      }

      // Validação dos dígitos verificadores
      const calcCheckDigit = (base: string, factor: number) => {
        let sum = 0;
        for (let i = 0; i < base.length; i++) {
          sum += parseInt(base[i]) * factor--;
        }
        const result = (sum * 10) % 11;
        return result === 10 ? 0 : result;
      };

      const firstCheck = calcCheckDigit(digits.slice(0, 9), 10);
      const secondCheck = calcCheckDigit(digits.slice(0, 10), 11);

      if (
        firstCheck !== parseInt(digits[9]) ||
        secondCheck !== parseInt(digits[10])
      ) {
        return helpers.error("string.cpf", {
          message: "CPF inválido (dígitos verificadores incorretos).",
        });
      }

      return digits;
    }, "BR CPF validator")
    .messages({
      "string.cpf": "{{#label}}: {{#message}}",
    });
}
