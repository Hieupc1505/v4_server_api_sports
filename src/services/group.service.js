const _Group = require("#models/group.model");
const _Tournament = require("#models/tournament.model");
const _Team = require("#models/team.model");
const _Match = require("#models/match.model");
const _Specific = require("#models/specific.model");
const _ = require("lodash");
const { BadRequestError } = require("#helpers/error.response");
const { getTourAndSeasonById } = require("#utils/getTourAndSeason.util");
const { standings: standingLink } = require("#utils/generateLink.util");
const axios = require("axios");
const {
    getFiveMatchRecent,
    convertFiveMatch,
    removeLastThreeDigits,
} = require("#utils/index");

class GroupService {
    static updateGroup = async ({ tournament, season }) => {
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tournament,
            season
        );

        // await _Specific.deleteMany({
        //     tournament: foundTour._id,
        // });

        // return _Group.deleteMany({
        //     tournament: foundTour._id,
        //     season: foundSeason._id,
        // });
        return 1;
    };

    static addGroup = async ({ tournament, season }) => {
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tournament,
            season
        );
        const link = standingLink(tournament, season);

        const { data } = await axios.get(link);

        const { standings } = data;
        for (let group of standings) {
            let specifics = [];
            const { rows } = group;
            for (let spec of rows) {
                const team = await _Team.findOne({ id: spec.team.id });
                const {
                    position,
                    matches,
                    wins,
                    scoresFor,
                    scoresAgainst,
                    id,
                    losses,
                    draws,
                    points,
                } = spec;
                const newSpec = await _Specific.create({
                    position,
                    matches,
                    wins,
                    scoresFor,
                    scoresAgainst,
                    id,
                    losses,
                    draws,
                    points,
                    team: team._id,
                    tournament: foundTour._id,
                    season: foundSeason._id,
                });
                specifics.push(newSpec._id);
            }
            await _Group.create({
                name: group.name,
                id: group.id,
                slug: group.tournament.slug,
                season: foundSeason._id,
                tournament: foundTour._id,
                rows: specifics,
            });
        }

        return 1;
    };

    static getFiveMatchRecent = async (tournament, season, teamId) => {
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tournament,
            season
        );

        let time = removeLastThreeDigits(new Date().getTime());

        const findFiveMatchRecent = await _Match.getResultFiveMatchRecently(
            foundTour._id,
            foundSeason._id,
            teamId,
            time
        );

        if (!findFiveMatchRecent) {
            throw new BadRequestError("Cannot find five match recently");
        }

        return convertFiveMatch(findFiveMatchRecent, teamId);
    };

    static standings = async ({ tournament, season }) => {
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tournament,
            season
        );

        let groups = await _Group
            .find({
                tournament: foundTour._id,
                season: foundSeason._id,
            })
            .populate({
                path: "rows",
                model: "Specific",
                populate: {
                    path: "team",
                    model: "Team",
                    select: { _id: 1, id: 1, shortName: 1, logo: 1 },
                },
            })
            .lean();
        for (let group of groups) {
            group.rows = _.orderBy(group.rows, ["points"], ["desc"]);
        }

        let fiveMatch = {};
        for (let group of groups) {
            const result = await getFiveMatchRecent(
                foundTour._id,
                foundSeason._id,
                group
            );
            fiveMatch = {
                ...fiveMatch,
                ...result,
            };
        }

        return { groups, fiveMatch };
    };
}

module.exports = GroupService;
