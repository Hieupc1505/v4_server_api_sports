const route = require("express").Router();
const HighlightController = require("#controllers/highlight.controller");
const { asyncHandler } = require("#helpers/asyncHandler.helper");

route.get("", asyncHandler(HighlightController.updateHighlight));

module.exports = route;
