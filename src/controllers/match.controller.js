"use-strict";

const { OK } = require("#helpers/success.response");
const MatchService = require("#services/match.service");

class MatchController {
    static updateMatch = async (req, res, next) => {
        new OK({
            message: "Update match success",
            metadata: await MatchService.updateMatch(req.params),
        }).send(res);
    };
    static changeFieldMatch = async (req, res, next) => {
        new OK({
            message: "change field match success",
            metadata: await MatchService.changeFieldMatch(),
        }).send(res);
    };
    static getMatchByRound = async (req, res, next) => {
        new OK({
            message: "getMatchByRound success",
            metadata: await MatchService.getMatchByRound(req.params),
        }).send(res);
    };
    static updateMatchResult = async (req, res, next) => {
        new OK({
            message: "getMatchByRound success",
            metadata: await MatchService.updateMatchResult(req.params),
        }).send(res);
    };
}

module.exports = MatchController;
