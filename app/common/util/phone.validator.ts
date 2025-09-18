import Joi from "joi";

// ---------- Helper: validador de telefone BR sem libs ----------
type PhoneFormat = "international" | "e164" | "national";

interface PhoneOptions {
  format?: PhoneFormat; // default: "international"
  requireAreaCode?: boolean; // default: true
  mobileOnly?: boolean; // default: false (aceita fixo e móvel)
}

export default function phoneBR(options: PhoneOptions = {}) {
  const {
    format = "international",
    requireAreaCode = true,
    mobileOnly = false,
  } = options;

  return Joi.string()
    .custom((value, helpers) => {
      if (typeof value !== "string") return helpers.error("string.base");

      // Remove tudo que não é dígito
      const digits = value.replace(/\D+/g, "");

      // Tira o prefixo 55 se veio com código do país
      const withoutCC = digits.startsWith("55") ? digits.slice(2) : digits;

      // Exige DDD?
      if (requireAreaCode && withoutCC.length < 10) {
        return helpers.error("string.brazilPhone", {
          message: "DDD ausente ou incompleto.",
        });
      }

      // Aceita 10 (fixo) ou 11 (móvel) dígitos após DDD
      if (!(withoutCC.length === 10 || withoutCC.length === 11)) {
        return helpers.error("string.brazilPhone", {
          message: "Tamanho inválido (esperado 10 ou 11 dígitos com DDD).",
        });
      }

      const ddd = withoutCC.slice(0, 2);
      const rest = withoutCC.slice(2);

      // DDD válido: 11–99 (não inicia com 0)
      if (!/^[1-9][0-9]$/.test(ddd)) {
        return helpers.error("string.brazilPhone", {
          message: "DDD inválido.",
        });
      }

      const isMobile = rest.length === 9;
      const isLandline = rest.length === 8;

      if (mobileOnly && !isMobile) {
        return helpers.error("string.brazilPhone", {
          message: "Apenas números móveis são aceitos.",
        });
      }

      // Regras de início do número
      if (isMobile && !/^9\d{8}$/.test(rest)) {
        return helpers.error("string.brazilPhone", {
          message: "Celular deve iniciar com 9 (11 dígitos após DDD).",
        });
      }
      if (isLandline && !/^[2-5]\d{7}$/.test(rest)) {
        return helpers.error("string.brazilPhone", {
          message: "Fixo deve iniciar com 2–5 (10 dígitos com DDD).",
        });
      }

      // Formatações de saída
      const e164 = `+55${ddd}${rest}`;
      const international = isMobile
        ? `+55 (${ddd}) ${rest.slice(0, 1)}${rest.slice(1, 5)}-${rest.slice(5)}`
        : `+55 (${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
      const national = isMobile
        ? `(${ddd}) ${rest.slice(0, 1)}${rest.slice(1, 5)}-${rest.slice(5)}`
        : `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;

      let formatted: string;
      switch (format) {
        case "e164":
          formatted = e164;
          break;
        case "national":
          formatted = national;
          break;
        default:
          formatted = international;
          break;
      }

      // Retorna o valor normalizado (pode transformar o valor)
      return formatted;
    }, "BR phone validator")
    .messages({
      "string.brazilPhone": "{{#label}}: {{#message}}",
    });
}
// ------------------ fim helper ------------------
