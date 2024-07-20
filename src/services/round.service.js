"use-strict";
const { BadRequestError } = require("#helpers/error.response");
const _Season = require("#models/season.model");
const _Round = require("#models/round.model");
const _Tournament = require("#models/tournament.model");
const { convertToObjectIdMongodb } = require("#utils/index");
const RoundFactory = require("#libs/round.lib");
const { getTourAndSeasonById } = require("#utils/getTourAndSeason.util");
class RoundService {
    static updateRound = async ({
        tournament,
        team_per_board,
        total,
        team_in_playoff,
        turn_in_board = 1,
        playoff = false,
        broze = false,
        current,
    }) => {
        return await _Round.findOneAndUpdate(
            { tournament: convertToObjectIdMongodb(tournament) },
            {
                $set: {
                    team_per_board,
                    team_in_playoff,
                    total,
                    playoff,
                    broze,
                    turn_in_board,
                    current,
                },
            },
            { upsert: true, new: true }
        );
    };

    static addRound = async ({ season, tournament, total, current }) => {
        const [foundSeason, foundTournament] = await Promise.all([
            _Season.findOne({ id: season }).lean(),
            _Tournament.findOne({ id: tournament }).lean(),
        ]);
        if (!foundSeason || !foundTournament)
            throw new BadRequestError("Cannot find season or tournament");

        return await _Round.create({
            total,
            current,
            tournament: foundTournament._id,
            season: foundSeason._id,
        });
    };

    static getRound = async ({ tournament, season }) => {
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tournament,
            season
        );

        let query = {
            tournament: convertToObjectIdMongodb(foundTour._id),
            season: foundSeason._id,
        };

        const roundQuery = await _Round.findOne(query).lean();
        if (!roundQuery) throw new BadRequestError("Can not get round");

        let rounds;
        if (roundQuery.playoff) {
            rounds = RoundFactory.generateRoundKnockOut(
                roundQuery.team_per_board,
                roundQuery.team_in_playoff,
                roundQuery.broze
            );
        } else {
            rounds = RoundFactory.generateRoundNormal(
                roundQuery.team_per_board,
                roundQuery?.total,
                roundQuery.turn_in_board
            );
        }

        return {
            currentRound: {
                round: roundQuery.current,
            },
            rounds,
        };
    };
}

module.exports = RoundService;

// [
//     {
//       $match:
//         /**
//          * query: The query in MQL.
//          */
//         {
//           league_id: new ObjectId(
//             "665ded649685701631d0b1fc"
//           ),
//         },
//     },
//     {
//       $unwind:
//         /**
//          * path: Path to the array field.
//          * includeArrayIndex: Optional name for index.
//          * preserveNullAndEmptyArrays: Optional
//          *   toggle to unwind null and empty values.
//          */
//         "$rows",
//     },
//     {
//       $group:
//         /**
//          * _id: The id of the group.
//          * fieldN: The first field name.
//          */
//         {
//           _id: 0,
//           totalRow: {
//             $sum: 1,
//           },
//         },
//     },
//     {
//       $project:
//         /**
//          * specifications: The fields to
//          *   include or exclude.
//          */
//         {
//           totalRow: 1,
//           _id: 0,
//         },
//     },
//   ]
