const _Team = require("#models/team.model");
const { logoLink } = require("#utils/generateLink.util");
const { getTourAndSeasonById } = require("#utils/getTourAndSeason.util");
const { convertToThumbnailUrl } = require("#utils/index");
const { uploadImage, uploadImageLink } = require("./upload.service");
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

    static addTeam = async (team) => {
        const img = await uploadImageLink(logoLink(team.id));

        const newTeam = {
            id: team.id,
            name: team.name,
            shortName: team.shortName,
            slug: team.slug,
            logo: img,
        };
        return await _Team.create(newTeam);
    };

    static getTeamById = async ({ id }) => {
        return await _Team.findTeam({ id });
    };
}

module.exports = TeamService;
