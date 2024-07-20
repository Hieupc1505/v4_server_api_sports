const route = require("express").Router();
const TournamentController = require("#controllers/tournament.controller");
const { asyncHandler } = require("#helpers/asyncHandler.helper");

route.get("", asyncHandler(TournamentController.init));
route.get("/:id", asyncHandler(TournamentController.getInfoTournament));

module.exports = route;
