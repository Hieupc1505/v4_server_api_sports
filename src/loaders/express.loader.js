/**
 * Configuration of the server middlewares.
 */
const morgan = require("morgan");
const compression = require("compression");
const express = require("express");
// const passport = require("passport");
// const expressWinston = require("express-winston");
// const methodOverride = require("method-override");
const helmet = require("helmet");
const cors = require("cors");
const expressStatusMonitor = require("express-status-monitor");
const mongoSanitize = require("express-mongo-sanitize");
// const winstonInstance = require( "./winston");

const isTest = process.env.NODE_ENV === "test";
const isDev = process.env.NODE_ENV === "development";

module.exports = (app) => {
    app.use(morgan("dev"));
    app.use(mongoSanitize());
    app.use(helmet());

    app.use(compression());
    app.use(express.json());
    app.use(cors());
    app.use(expressStatusMonitor());

    // if (isDev && !isTest) {
    //     app.use(morgan("dev"));
    //     expressWinston.requestWhitelist.push("body");
    //     expressWinston.responseWhitelist.push("body");
    //     app.use(
    //         expressWinston.logger({
    //             winstonInstance,
    //             meta: true,
    //             msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    //             colorStatus: true,
    //         })
    //     );
    // }
};
