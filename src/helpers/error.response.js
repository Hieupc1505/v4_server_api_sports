"use-strict";
const { env } = require("#configs/constants.config");
const httpStatus = require("http-status");
const myLogger = require("#loggers/mylogger.log");

// class ErrorResponse extends Error {
//     constructor(message, status) {
//         super(message);
//         this.statusCode = status;
//         Error.captureStackTrace(this, this.constructor);
//     }
// }
class ErrorResponse extends Error {
    constructor(message, statusCode, stack = null) {
        super(message);

        this.statusCode = statusCode;
        // this.stack = stack;

        // if (env.isDevelopment) {
        //     Error.captureStackTrace(this, this.constructor);
        // } else {
        //     this.stack = null;
        // }
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message = httpStatus[httpStatus.CONFLICT],
        statusCode = httpStatus.CONFLICT
    ) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = httpStatus[httpStatus.BAD_REQUEST],
        statusCode = httpStatus.BAD_REQUEST
    ) {
        super(message, statusCode);
    }
}
class AuthFailureError extends ErrorResponse {
    constructor(
        message = httpStatus[httpStatus.UNAUTHORIZED],
        statusCode = httpStatus.UNAUTHORIZED
    ) {
        super(message, statusCode);
    }
}
class NotFoundError extends ErrorResponse {
    constructor(
        message = httpStatus[httpStatus.NOT_FOUND],
        statusCode = httpStatus.NOT_FOUND
    ) {
        super(message, statusCode);
    }
}
class ForbiddenError extends ErrorResponse {
    constructor(
        message = httpStatus[httpStatus.FORBIDDEN],
        statusCode = httpStatus.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}
class InternalserverError extends ErrorResponse {
    constructor(
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
    ) {
        super(message, statusCode);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
    ErrorResponse,
    InternalserverError,
};
