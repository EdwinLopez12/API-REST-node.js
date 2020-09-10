const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

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

const deleteValidation = data => {
    const schema = Joi.object({
        id: Joi.number()
            .required()
    });
    return schema.validate(data);
};


module.exports.searchValidation = searchValidation;
module.exports.updateValidation = updateValidation;
module.exports.deleteValidation = deleteValidation;