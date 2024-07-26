const { OK } = require("#helpers/success.response");
const TeamService = require("#services/team.service");
class TeamController {
    static initTeam = async (req, res, next) => {
        new OK({
            message: "init Team success",
            metadata: await TeamService.initTeam(),
        }).send(res);
    };
    static findTeam = async (req, res, next) => {
        new OK({
            message: "Find Team success",
            metadata: await TeamService.getTeamById(req.query),
        }).send(res);
    };
}

module.exports = TeamController;
