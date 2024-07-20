const httpStatus = require("http-status");
const { env } = require("#configs/constants.config");
const {
    ErrorResponse,
    InternalserverError,
} = require("#helpers/error.response");
const mongoose = require("mongoose");
const myLogger = require("#loggers/mylogger.log");
const { extractFilenameFromStack } = require("#utils/index");
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ErrorResponse)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error
                ? httpStatus.BAD_REQUEST
                : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ErrorResponse(message, statusCode, err.stack);
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
        ...(env.isDevelopment && { path: req.path }),
        ...(env.isDevelopment && {
            request: req.method === "POST" ? req.body : req.query,
        }),
        ...(env.isDevelopment && { stack: err.stack }),
    };
    if (env.isDevelopment) {
        // console.dir(response, null, 2);
    }

    if (!env.isDevelopment && env.isProduction)
        myLogger.error(err.message, [
            req.path,
            extractFilenameFromStack(err.stack),
            { traceId: req?.traceId },
            req.method === "POST" ? req.body : req.query,
        ]);

    return res.status(statusCode).json(response);
};

module.exports = {
    errorHandler,
    errorConverter,
};
