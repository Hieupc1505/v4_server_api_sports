const _Team = require("#models/team.model");

const { convertToThumbnailUrl } = require("#utils/index");
class TeamService {
    static initTeam = async () => {
        const query = {},
            updateSet = [
                { $set: { team_thumbnail: { $toString: "$team_logo" } } },
            ],
            options = { upsert: true, new: true };
        // return await _Team.updateMany(query, updateSet, options);
        return 1;
    };
    static getTeamById = async ({ id }) => {
        return await _Team.findTeam({ id });
    };
}

module.exports = TeamService;
