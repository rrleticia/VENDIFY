import Joi from "joi";

export function dateBR() {
  return Joi.string()
    .custom((value, helpers) => {
      if (typeof value !== "string") return helpers.error("string.base");

      // Regex para formato dd/mm/yyyy
      const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
      if (!match) {
        return helpers.error("string.dateBR", {
          message: "Formato inválido. Use dd/mm/aaaa.",
        });
      }

      const [_, day, month, year] = match.map(Number);

      const date = new Date(year, month - 1, day);
      const valid =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

      if (!valid) {
        return helpers.error("string.dateBR", {
          message: "Data inválida (inexistente no calendário).",
        });
      }

      return value;
    }, "BR date validator")
    .messages({
      "string.dateBR": "{{#label}}: {{#message}}",
    });
}
