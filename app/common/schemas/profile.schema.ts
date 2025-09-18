import Joi from "joi";
import phoneBR from "@common/util/phone.validator";
import { cpfBR, dateBR } from "@common/util";

export const ProfileSchema = Joi.object().keys({
  name: Joi.string().trim().min(1),
  // ✅ Sem joi-phone-number; usando nosso validador custom
  phone: phoneBR({ format: "international", requireAreaCode: true }),
  cpf: cpfBR(),
  nascimento: dateBR(),
});
