const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const searchValidation = data => {
    const schema = Joi.object({
        id: Joi.number()
            .required()
    });
    return schema.validate(data);
};

const createValidation = data => {
    const schema = Joi.object({
        id: Joi.number()
            .required(),
        name: Joi.string()
            .required()
            .max(255)
            .min(5),
        description: Joi.string()
            .required()
            .max(255)
            .min(6)
    });
    return schema.validate(data);
};

const updateValidation = data => {
    const schema = Joi.object({
        id: Joi.number()
            .required(),
        name: Joi.string()
            .required()
            .max(255)
            .min(5),
        description: Joi.string()
            .required()
            .max(255)
            .min(6)
    })
    return schema.validate(data);
};

const deleteValidation = data =>{
    const schema = Joi.object({
        id: Joi.number()
        .required()
    });
    return schema.validate(data);
};

module.exports.searchValidation = searchValidation;
module.exports.createValidation = createValidation;
module.exports.updateValidation = updateValidation;
module.exports.deleteValidation = deleteValidation;