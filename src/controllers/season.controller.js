const { OK } = require("#helpers/success.response");
const SeasonService = require("#services/season.service");
class SeasonController {
    static initSeason = async (req, res, next) => {
        new OK({
            message: "init Season success",
            metadata: await SeasonService.init(),
        }).send(res);
    };
    static cloneSeason = async (req, res, next) => {
        new OK({
            message: "clone Season success",
            metadata: await SeasonService.cloneSeason(req.body),
        }).send(res);
    };
    static updateSeason = async (req, res, next) => {
        new OK({
            message: "udpate Season success",
            metadata: await SeasonService.updateSeason(req.params, req.body),
        }).send(res);
    };

    static getSeason = async (req, res, next) => {
        new OK({
            message: "udpate Season success",
            metadata: await SeasonService.getSeason(req.query),
        }).send(res);
    };
    static listSeason = async (req, res, next) => {
        new OK({
            message: "udpate Season success",
            metadata: await SeasonService.getListSeason(req.query),
        }).send(res);
    };
}

module.exports = SeasonController;
