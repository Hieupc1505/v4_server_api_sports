const route = require("express").Router();
const GroupController = require("#controllers/group.controller");
const { asyncHandler } = require("#helpers/asyncHandler.helper");

route.get("/:tournament/:season", asyncHandler(GroupController.updateGroup));
route.get(
    "/:tournament/season/:season/add",
    asyncHandler(GroupController.addGroup)
);

module.exports = route;
