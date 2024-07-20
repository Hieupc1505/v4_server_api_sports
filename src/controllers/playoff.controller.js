const { OK } = require("#helpers/success.response");
const PlayoffService = require("#services/playoff.service");

class PlayoffController {
    static addPlayoffMatch = async (req, res, next) => {
        new OK({
            message: "add playoff match success",
            metadata: await PlayoffService.addPlayoffMatch(req.body),
        }).send(res);
    };

    static getPlayoffMatch = async (req, res, next) => {
        new OK({
            message: "get playoff match",
            metadata: await PlayoffService.getKnockoutByParentId({
                ...req.params,
                ...req.query,
            }),
        }).send(res);
    };

    static updatePlayoff = async (req, res, next) => {
        new OK({
            message: "update Playoff success",
            metadata: await PlayoffService.updatePlayoff(),
        }).send(res);
    };
    static getPlayoffMatchv2 = async (req, res, next) => {
        new OK({
            message: "update Playoff success",
            metadata: await PlayoffService.getKnockoutByParentIdv2(req.params),
        }).send(res);
    };
}

module.exports = PlayoffController;
