const route = require("express").Router();
const RoundController = require("#controllers/round.controller");
const { asyncHandler } = require("#helpers/asyncHandler.helper");

route.post("", asyncHandler(RoundController.addRound));
route.post("/update", asyncHandler(RoundController.updateRound));
route.get(
    "/:tournament/rounds/:season",
    asyncHandler(RoundController.getRound)
);

module.exports = route;
