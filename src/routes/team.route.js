const route = require("express").Router();
const TeamController = require("#controllers/team.controller");
const { asyncHandler } = require("#helpers/asyncHandler.helper");

route.get("", asyncHandler(TeamController.initTeam));
route.get("/find", asyncHandler(TeamController.findTeam));

module.exports = route;
