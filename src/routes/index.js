const express = require("express");

const accessRoute = require("./access.route");

const router = express.Router();

//prefixRoute: /api
const defaultRoutes = [
    {
        path: "/v1/shop",
        route: accessRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
