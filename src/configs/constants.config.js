const dotenv = require("dotenv");
const path = require("path");
const {
    getOsEnvOptional,
    getOsEnv,
    normalizePort,
    toBool,
    toNumber,
} = require("#libs/os");

/**
 * Load .env file or for tests the .env.test, .env.production file.
 */
dotenv.config({
    path: path.join(
        process.cwd(),
        `.env${process.env.NODE_ENV === "test" ? ".test" : ""}`
    ),
});
const common = {
    node: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    isTest: process.env.NODE_ENV === "test",
    isDevelopment: process.env.NODE_ENV === "development",
    log: {
        level: getOsEnv("LOG_LEVEL"),
        json: toBool(getOsEnvOptional("LOG_JSON")),
        output: getOsEnv("LOG_OUTPUT"),
        // dirname: getOsEnv("LOG_DIRNAME"),
    },
};

const dev = {
    ...common,
    app: {
        port: getOsEnv("DEV_APP_PORT"),
        routePrefix: getOsEnv("APP_ROUTE_PREFIX"),
        port: normalizePort(process.env.PORT || getOsEnv("APP_PORT")),
        banner: toBool(getOsEnv("DEV_APP_BANNER")),
    },
    db: {
        host: getOsEnv("DEV_DB_HOST"),
    },
};

const prod = {
    common,
    app: {
        port: process.env.PRO_APP_PORT,
        routePrefix: getOsEnv("APP_ROUTE_PREFIX"),
        port: normalizePort(process.env.PORT || getOsEnv("APP_PORT")),
        banner: toBool(getOsEnv("PRO_APP_BANNER")),
    },
    db: {
        host: getOsEnv("PRO_DB_HOST"),
    },
};

const config = {
    development: dev,
    production: prod,
};

const node = process.env.NODE_ENV || "development";

module.exports = { env: config[node] };
