const express = require("express");

const accessRoute = require("./access.route");
const teamRoute = require("./team.route");
const tournamentRoute = require("./tournament.route");
const seasonRoute = require("./season.route");
const roundRoute = require("./round.route");
const commonRoute = require("./common.route");
const groupRoute = require("./group.route");
const playoffRoute = require("./playoff.route");
const highlightRoute = require("./highlight.route");

const router = express.Router();

//prefixRoute: /api
const defaultRoutes = [
    {
        path: "/v1/shop",
        route: accessRoute,
    },
    {
        path: "/v1/teams",
        route: teamRoute,
    },
    {
        path: "/v1/tournament",
        route: tournamentRoute,
    },
    {
        path: "/v1/group",
        route: groupRoute,
    },
    {
        path: "/v1/seasons",
        route: seasonRoute,
    },
    {
        path: "/v1/playoff",
        route: playoffRoute,
    },
    {
        path: "/v1/rounds",
        route: roundRoute,
    },
    {
        path: "/v1/highlight",
        route: highlightRoute,
    },
    {
        path: "/v1/football",
        route: commonRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
