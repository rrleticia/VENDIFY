import Joi from "joi";

export const LoginSchema = Joi.object().keys({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
  password: Joi.string().min(8).required(),
  // access_token: [Joi.string(), Joi.number()],
});
