import Joi from "joi";
import phoneBR from "@common/validators/phone.validator";
import { cpfBR, dateBR } from "@common/validators";

export const ProfileSchema = Joi.object().keys({
  name: Joi.string().trim().min(1),
  phone: phoneBR({ format: "international", requireAreaCode: true }),
  cpf: cpfBR(),
  nascimento: dateBR(),
});
