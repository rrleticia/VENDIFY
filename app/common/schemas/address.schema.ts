import Joi from "joi";

export const AddressSchema = Joi.object().keys({
  label: Joi.string().trim().min(1),
});
