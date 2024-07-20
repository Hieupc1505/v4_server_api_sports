const Joi = require("joi");
const httpStatus = require("http-status");

const { BadRequestError } = require("#helpers/error.response");
const _ = require("lodash");

module.exports = (schema) => (req, res, next) => {
    const validSchema = _.pick(schema, ["params", "query", "body"]);
    const object = _.pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: "key" }, abortEarly: false })
        .validate(object);

    if (error) {
        const errorMessage = error.details
            .map((details) => details.message)
            .join(",");

        return next(new BadRequestError(errorMessage));
    }
    Object.assign(req, value);
    return next();
};
