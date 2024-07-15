const { v4: uuidv4 } = require("uuid");
const myLogger = require("#loggers/mylogger.log");

const { env } = require("#configs/constants.config");
const traceIdMiddleware = (req, res, next) => {
    const traceId = req.headers["x-trace-id"] || uuidv4();
    req.traceId = traceId;
    res.setHeader("x-trace-id", traceId);
    if (env.isProduction && !isDevelopment)
        myLogger.log("input params", [
            __filename,
            { req: req.traceId },
            req.method === "POST" ? req.body : req.query,
        ]);
    next();
};
module.exports = {
    traceIdMiddleware,
};
