const route = require("express").Router();
const SeasonController = require("#controllers/season.controller");
const { asyncHandler } = require("#helpers/asyncHandler.helper");

route.get("", asyncHandler(SeasonController.getSeason));
route.get("/list", asyncHandler(SeasonController.listSeason));
route.post("", asyncHandler(SeasonController.cloneSeason));
route.post("/update", asyncHandler(SeasonController.updateSeason));

module.exports = route;
