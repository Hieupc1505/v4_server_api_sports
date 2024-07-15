const httpStatus = require("http-status");
const { env } = require("#configs/constants.config");
const { ErrorResponse } = require("#helpers/error.response");
const mongoose = require("mongoose");
const errorConverter = (err, req, res, next) => {
    let error = err;

    if (!(error instanceof ErrorResponse)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error
                ? httpStatus.BAD_REQUEST
                : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ErrorResponse(message, { statusCode, stack: err.stack });
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const { statusCode, message } = err;

    if (env.isProduction) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    const response = {
        code: statusCode,
        message,
        ...(env.isDevelopment && { stack: err.stack }),
    };
    if (env.isDevelopment) {
        // console.dir(response, null, 2);
    }

    return res.status(statusCode).json(response);
};

module.exports = {
    errorHandler,
    errorConverter,
};
