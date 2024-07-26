const _Playoff = require("#models/playoff.model");
const { getTourAndSeasonById } = require("#utils/getTourAndSeason.util");
const { playoffMatchByRound } = require("#utils/generateLink.util");
const { getRoundPlayoff, getParentMatchId } = require("#utils/index");
const { BadRequestError } = require("#helpers/error.response");
const {
    handlePlayoffMatchData,
    createMatch,
    createPlayoffDocument,
} = require("#models/repositories/playoff.repo");
const _ = require("lodash");

const axios = require("axios");

class PlayoffService {
    static getPlayoffById = async ({ id }) => {
        return await _Playoff.findPlayoff({ id });
    };

    static addPlayoffMatch = async ({
        tour,
        season,
        round_slug,
        matches_parentId = null,
    }) => {
        const roundInfo = getRoundPlayoff(round_slug);
        if (!roundInfo) throw new BadRequestError("Round not found");
        const roundlink = playoffMatchByRound(
            tour,
            season,
            roundInfo.round,
            roundInfo.name
        );

        const { events } = await axios.get(roundlink).then((res) => res.data);

        const groupByCustomId = _.values(_.groupBy(events, "customId"));
        // return groupByCustomId;
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tour,
            season
        );

        if (!matches_parentId) {
            const newMatch = await createMatch(
                groupByCustomId[0][0],
                foundTour._id,
                foundSeason._id
            );
            await createPlayoffDocument(
                foundTour._id,
                foundSeason._id,
                null,
                [newMatch._id],
                getRoundPlayoff(round_slug).round
            );
            return 1;
        }

        for (let matchParentId of matches_parentId) {
            const playoffParent = await _Playoff
                .findById(matchParentId)
                .populate({
                    path: "matches",
                    model: "Match",
                    populate: [
                        {
                            path: "home_team",
                            model: "Team",
                            select: "id",
                        },
                        {
                            path: "away_team",
                            model: "Team",
                            select: "id",
                        },
                    ],
                })
                .lean();

            const homeTeamParent = _.get(
                playoffParent,
                "matches[0].home_team.id"
            );
            const awayTeamParent = _.get(
                playoffParent,
                "matches[0].away_team.id"
            );

            const matches_child = groupByCustomId.filter((o) => {
                const homeTeamChild = o[0]?.homeTeam?.id;
                const awayTeamChild = o[0]?.awayTeam?.id;

                return (
                    homeTeamParent === homeTeamChild ||
                    homeTeamParent === awayTeamChild ||
                    awayTeamParent === homeTeamChild ||
                    awayTeamParent === awayTeamChild
                );
            });

            for (let matchgroups of matches_child) {
                let matchesIdPlayoff = [];
                for (let match of matchgroups) {
                    const newMatch = await createMatch(
                        match,
                        foundTour._id,
                        foundSeason._id
                    );
                    matchesIdPlayoff.push(newMatch._id);
                }
                await createPlayoffDocument(
                    foundTour._id,
                    foundSeason._id,
                    matchParentId,
                    matchesIdPlayoff,
                    getRoundPlayoff(round_slug).round
                );
            }
        }
        return 1;
    };

    static getKnockoutByParentId = async ({
        tournament,
        season,
        parentKnockoutId = null,
        limit = 50,
        offset = 0, //skip
    }) => {
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tournament,
            season
        );

        if (parentKnockoutId) {
            const parent = await _Playoff.findById(parentKnockoutId);
            if (!parent)
                throw new NotFoundError("Not found comment for parent");

            const knockout = await _Playoff
                .find({
                    tournament: foundTour._id,
                    season: foundSeason._id,
                    playoff_left: { $gt: parent.playoff_left },
                    playoff_right: { $lte: parent.playoff_right },
                })
                .populate(["matches"])
                .select({
                    round: 1,
                    matches: 1,
                    playoff_parent: 1,
                    round_id: 1,
                    next_round: 1,
                })
                .sort({
                    playoff_left: 1,
                });

            return knockout;
        }
        const knockout = await _Playoff
            .find({
                tournament: foundTour._id,
                season: foundSeason._id,
            })
            .populate(["matches"])
            .select({
                round: 1,
                matches: 1,
                playoff_parent: 1,
                round_id: 1,
                next_round: 1,
            })
            .sort({
                playoff_left: 1,
            });

        return knockout;
    };

    static getKnockoutByParentIdv2 = async ({
        tournament,
        season,
        parentKnockoutId = null,
    }) => {
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tournament,
            season
        );
        return await _Playoff
            .find({
                tournament: foundTour._id,
                season: foundSeason._id,
            })
            .populate({
                path: "matches",
                model: "Match",
                populate: [
                    {
                        path: "home_team",
                        model: "Team",
                    },
                    {
                        path: "away_team",
                        model: "Team",
                    },
                ],
            });
    };

    static updatePlayoff = async () => {
        return await _Playoff.updateMany(
            {},
            {
                $unset: {
                    match: "",
                },
            }
        );
    };
}

module.exports = PlayoffService;

// $set: {
//     matches: {
//         $cond: {
//             if: { $gt: ["$match", null] },
//             then: [{ $toObjectId: "$match" }],
//             else: [],
//         },
//     },
// },
