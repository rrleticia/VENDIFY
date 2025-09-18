import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
import phoneBR from "@common/util/phone.validator";

const joiPassword = Joi.extend(joiPasswordExtendCore);

// Seu schema adaptado
export const RegisterSchema = Joi.object().keys({
  name: Joi.string().trim().min(1).required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "br"] },
    })
    .required(),

  // ✅ Sem joi-phone-number; usando nosso validador custom
  phone: phoneBR({ format: "international", requireAreaCode: true }),

  password: joiPassword
    .string()
    .min(8)
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .onlyLatinCharacters()
    .doesNotInclude(["password", "12345678", "aaaaaaaa"]),

  role: Joi.string()
    .trim()
    .uppercase()
    .valid("USER", "user", "VENDOR", "vendor", "EDITOR", "editor"),
});
