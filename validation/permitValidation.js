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
            .max(255)
            .min(6)
            .required(),
        actions: Joi.array()
            .items(Joi.string().max(1)
                .min(1))
            .required(),
        description: Joi.string()
            .max(255)
            .min(6)
            .required(),
    });
    return schema.validate(data);
};

const updateValidation = data => {
    const schema = Joi.object({
        id: Joi.number()
            .required(),
        name: Joi.string()
            .max(255)
            .min(6)
            .required(),
        actions: Joi.array()
            .items(Joi.string().max(1)
                .min(1))
            .required(),
        description: Joi.string()
            .max(255)
            .min(6)
            .required(),
    });
    return schema.validate(data);
};

module.exports.searchValidation = searchValidation;
module.exports.createValidation = createValidation;
module.exports.updateValidation = updateValidation;