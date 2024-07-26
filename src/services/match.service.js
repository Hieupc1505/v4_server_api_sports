"use-strict";
const { BadRequestError } = require("#helpers/error.response");
const _Match = require("#models/match.model");
const _Highlight = require("#models/highlight.model");
const _Tournament = require("#models/tournament.model");
const _Specific = require("#models/specific.model");
const { convertTimeToInt } = require("#utils/index");
const { matchById, standings } = require("#utils/generateLink.util");
const axios = require("axios");
const _ = require("lodash");
const { getTourAndSeasonById } = require("#utils/getTourAndSeason.util");

class MatchService {
    static updateMatch = async ({ tournament, season }) => {
        const matches = await _Match.find({ winnerCode: { $exists: false } });
        for (let match of matches) {
            const { event } = await axios
                .get(matchById(match.id))
                .then((res) => res.data);
            match.winnerCode = event.winnerCode;
            await match.save();
        }
        return 1;
    };

    static updateStartTimeMatch = async () => {
        return 1;
    };

    static changeFieldMatch = async () => {
        await _Match.updateMany(
            {},
            {
                $rename: {
                    league_id: "tournament",
                    season_id: "season",
                },
            }
        );
    };

    static getMatchByRound = async ({ tournament, season, round }) => {
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tournament,
            season
        );

        const populateField = [
            {
                path: "home_team",
                select: { _id: 1, id: 1, shortName: 1, logo: 1 },
            },
            {
                path: "away_team",
                select: { _id: 1, id: 1, shortName: 1, logo: 1 },
            },
            { path: "highlight" },
        ];

        return await _Match
            .find({
                tournament: foundTour._id,
                season: foundSeason._id,
                round: +round,
            })
            .populate(populateField)
            .sort({ startTime: 1 });
    };
    static updateMatchResult = async ({ tournament, season }) => {
        const foundTour = await _Tournament.findOne({ id: tournament });
        const finishMatch = 100,
            notStart = 0;
        const specs = await _Match.find({
            tournament: foundTour._id,
            startTime: {
                $lte: convertTimeToInt(0.25),
            },
            "status.code": notStart,
        });

        const { data } = await axios.get(standings(tournament, season));

        for (let item of specs) {
            const { data: data2 } = await axios.get(matchById(item.id));
            if (data2 && data2.event.status.code >= finishMatch) {
                let event = data2.event;
                item.status = event.status;
                item.home_team_score = event.homeScore;
                item.away_team_score = event.awayScore;
                item.winnerCode = event.winnerCode;
                await item.save();
            }
        }

        for (let { rows } of data.standings) {
            for (let {
                position,
                matches,
                wins,
                losses,
                scoresFor,
                scoresAgainst,
                draws,
                points,
                id,
            } of rows) {
                await _Specific.findOneAndUpdate(
                    { id: id },
                    {
                        $set: {
                            position: position,
                            matches: matches,
                            wins: wins,
                            losses: losses,
                            scoresFor: scoresFor,
                            scoresAgainst: scoresAgainst,
                            draws: draws,
                            points: points,
                        },
                    }
                );
            }
        }

        return 1;
    };
}

module.exports = MatchService;
