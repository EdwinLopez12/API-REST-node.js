// Validación
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

const registerValidation = data => {
  const schema = Joi.object({
    id: Joi.number()
      .required(),
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
    _rol: Joi.objectId().required(),
    _permisos: Joi.objectId()
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

const searchValidation = data => {
  const schema = Joi.object({
    id: Joi.number()
      .required()
  });
  return schema.validate(data);
};

const updateValidation = data => {
  const schema = Joi.object({
    id: Joi.number()
      .required(),
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
    _rol: Joi.objectId().required(),
    _permisos: Joi.objectId()
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.searchValidation = searchValidation;
module.exports.updateValidation = updateValidation;