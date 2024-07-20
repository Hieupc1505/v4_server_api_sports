const { OK } = require("#helpers/success.response");
const TournamentService = require("#services/tournament.service");
class TeamController {
    static init = async (req, res, next) => {
        new OK({
            message: "init Team success",
            metadata: await TournamentService.initTournament(),
        }).send(res);
    };
    static getInfoTournament = async (req, res, next) => {
        new OK({
            message: "Get Info Tournament Success",
            metadata: await TournamentService.getInfoTournament(req.params),
        }).send(res);
    };
    static getListTournament = async (req, res, next) => {
        new OK({
            message: "Get List Tournament Success",
            metadata: await TournamentService.getListTournament(),
        }).send(res);
    };
}

module.exports = TeamController;
