"use-strict";

const express = require("express");
const accessController = require("#controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("#helpers/asyncHandler.helper");
const { loginSchema } = require("#validations/access.validation");
const validate = require("#middlewares/validate.middleware");

router.get(
    "/login",
    validate(loginSchema),
    asyncHandler(accessController.login)
);

module.exports = router;
