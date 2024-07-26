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

    static addRound = async ({
        tournament,
        season,
        total,
        current,
        team_per_board,
        turn_in_board = 2,
        broze = false,
        playoff = false,
        team_in_playoff = 0,
    }) => {
        const foundSeason = await _Season.findOne({ id: season }).lean();
        const foundTour = await _Tournament.findOne({ id: tournament });
        if (!foundSeason || !foundTour)
            throw new BadRequestError("Canot found tour and season");

        return await _Round.create({
            total,
            current,
            tournament: foundTour._id,
            season: foundSeason._id,
            team_per_board,
            turn_in_board,
            broze,
            playoff,
            team_in_playoff,
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
