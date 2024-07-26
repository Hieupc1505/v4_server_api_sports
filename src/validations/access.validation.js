const Joi = require("joi");

const { password } = require("./custom.validation");

const loginSchema = {
    body: Joi.object().keys({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
            .required(),
        password: Joi.string().required(),
    }),
};

const registerSchema = {
    body: Joi.object().keys({
        displayName: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required().custom(password),
    }),
};

module.exports = {
    loginSchema,
    registerSchema,
};
