const route = require("express").Router();
const PlayoffController = require("#controllers/playoff.controller");
const { asyncHandler } = require("#helpers/asyncHandler.helper");

route.get("", asyncHandler(PlayoffController.updatePlayoff));

module.exports = route;
