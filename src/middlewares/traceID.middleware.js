const { v4: uuidv4 } = require("uuid");
const myLogger = require("#loggers/mylogger.log");
const { extractFilenameFromStack } = require("#utils/index");

const { env } = require("#configs/constants.config");
const traceIdMiddleware = (req, res, next) => {
    const traceId = req.headers["x-trace-id"] || uuidv4();
    req.traceId = traceId;
    res.setHeader("x-trace-id", traceId);
    if (env.isProduction)
        myLogger.log("input params", [
            req.path,
            extractFilenameFromStack(__filename),
            { traceId: req?.traceId },
            req.method === "POST" ? req.body : req.query,
        ]);
    next();
};
module.exports = {
    traceIdMiddleware,
};
