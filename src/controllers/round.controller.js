"use-strict";

const RoundService = require("#services/round.service");
const { OK } = require("#helpers/success.response");

class RoundController {
    static async addRound(req, res, next) {
        new OK({
            message: "Add round success",
            metadata: await RoundService.addRound(req.body),
        }).send(res);
    }
    static async getRound(req, res, next) {
        new OK({
            message: "Get round success",
            metadata: await RoundService.getRound(req.params),
        }).send(res);
    }
    static async updateRound(req, res, next) {
        new OK({
            message: "update Round success",
            metadata: await RoundService.updateRound(req.body),
        }).send(res);
    }
}

module.exports = RoundController;
