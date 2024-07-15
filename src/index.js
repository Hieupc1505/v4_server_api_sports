"use-strict";
const express = require("express");

// import "./config/database";
// import middlewaresConfig from "./config/middlewares";
const { env } = require("#configs/constants.config");
const expressLoaderConfig = require("#loaders/express.loader");
const {
    errorHandler,
    errorConverter,
} = require("#middlewares/error.middleware");
const ApiRoutes = require("#routes/index");
const { NotFoundError } = require("#helpers/error.response");
const { traceIdMiddleware } = require("#middlewares/traceID.middleware");

const app = express();

//conect database
require("#configs/db.config");

// Wrap all the middlewares with the server
expressLoaderConfig(app);
app.use(traceIdMiddleware);
// Add the apiRoutes stack to the server
app.use(env.app.routePrefix, ApiRoutes);

app.use((req, res, next) => {
    next(new NotFoundError("Page not found"));
});

//handler error
app.use(errorConverter);
app.use(errorHandler);

// We need this to make sure we don't run a second instance
let server;
if (!module.parent) {
    server = app.listen(env.app.port, (err) => {
        if (err) {
            console.log("Cannot run!", err);
        } else {
            console.log(`App is running at::::${env.app.port}`);
        }
    });
}

process.on("SIGINT", () => {
    console.log("Received SIGINT. Closing server...");
    server.close(() => {
        console.log("Server closed. Exiting process...");
        process.exit(0); // Kết thúc quá trình với mã 0 (thành công)
    });
});

module.exports = app;
