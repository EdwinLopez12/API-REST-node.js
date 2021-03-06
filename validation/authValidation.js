const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

const registerValidation = data => {
  const schema = Joi.object({
    id: Joi.number()
      .required(),
    name: Joi.string()
      .min(6)
      .max(255)
      .required(),
    email: Joi.string()
      .min(6)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(1024)
      .required(),
    _rol: Joi.array()
      .items(
        Joi.objectId()
      )
      .required(),
    specialPermits: Joi.array().items(
      {
        name: Joi.string()
          .min(6)
          .max(255)
          .required(),
        actions: Joi.array().items(
          Joi.string()
            .max(1)
            .min(1)
            .required()
        )
      }
    )
  });
  return schema.validate(data);
};

const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;