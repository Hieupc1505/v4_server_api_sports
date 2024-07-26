const _Playoff = require("../playoff.model");
const _Match = require("../match.model");
const _Season = require("../season.model");
const _Tournament = require("../tournament.model");
const _Team = require("../team.model");
const _ = require("lodash");
const { asyncHandler } = require("#helpers/asyncHandler.helper");
const { BadRequestError } = require("#helpers/error.response");
const { getRoundPlayoff, getParentMatchId } = require("#utils/index");

const handlePlayoffMatchData = async (
    match,
    matches_parentId = null,
    index
) => {
    let match_parentId = null;

    if (matches_parentId?.length)
        match_parentId = matches_parentId[Math.floor(index / 2)];

    const {
        homeTeam,
        awayTeam,
        season,
        tournament,
        id,
        winnerCode,
        roundInfo,
        status,
        startTimestamp,
        slug,
        homeScore,
        awayScore,
        customId,
    } = _.pick(match, [
        "homeTeam",
        "awayTeam",
        "homeScore",
        "awayScore",
        "season",
        "tournament",
        "id",
        "winnerCode",
        "roundInfo",
        "status",
        "startTimestamp",
        "slug",
        "customId",
    ]);
    const [fhomeTeam, fawayTeam, ftournament, fseason] = await Promise.all([
        _Team
            .findOne({
                id: homeTeam.id,
            })
            .lean(),
        _Team
            .findOne({
                id: awayTeam.id,
            })
            .lean(),
        _Tournament.findOne({ id: tournament.uniqueTournament.id }).lean(),
        _Season.findOne({ id: season.id }).lean(),
    ]);

    const newMatch = {
        id: id,
        round: roundInfo.round,
        home_team: fhomeTeam?._id || null,
        away_team: fawayTeam?._id || null,
        home_team_score: homeScore ?? {},
        away_team_score: awayScore ?? {},
        tournament: ftournament._id,
        season: fseason._id,
        status: status, //100 end, 60: postponed, 0: not start, 50: đoán cacnel
        startTime: startTimestamp,
        slug: slug,
        winnerCode: winnerCode || null,
        customId,
    };
    const matchInfo = await _Match.create(newMatch);
    const knockoutRound = new _Playoff({
        tournament: ftournament._id,
        season: fseason._id,
        match: matchInfo._id,
        round: roundInfo.round,
        round_name: getRoundPlayoff(roundInfo.round).name,
        next_round: getRoundPlayoff(roundInfo.round).next,
    });

    let rightValue;
    if (match_parentId) {
        //reply comment
        const parentKnockout = await _Playoff.findById(match_parentId);
        if (!parentKnockout)
            throw new BadRequestError("parent playoff not found");
        rightValue = parentKnockout.playoff_right;
        await _Playoff.updateMany(
            {
                tournament: ftournament._id,
                season: fseason._id,
                playoff_right: { $gte: rightValue },
            },
            {
                $inc: { playoff_right: 2 },
            }
        );
        await _Playoff.updateMany(
            {
                tournament: ftournament._id,
                season: fseason._id,
                playoff_left: { $gt: rightValue },
            },
            {
                $inc: { playoff_left: 2 },
            }
        );
    } else {
        const maxRightValue = await _Playoff.findOne(
            {
                tournament: ftournament._id,
                season: fseason._id,
            },
            "playoff_right",
            { sort: { playoff_right: -1 } }
        );
        if (maxRightValue) {
            rightValue = maxRightValue.playoff_right + 1;
        } else {
            rightValue = 1;
        }
    }
    knockoutRound.playoff_parent = matches_parentId
        ? await getParentMatchId(
              fhomeTeam?._id,
              fawayTeam?._id,
              matches_parentId
          )
        : matches_parentId;

    knockoutRound.playoff_left = rightValue;
    knockoutRound.playoff_right = rightValue + 1;

    await knockoutRound.save();
    // }
};

const createMatch = async (match, tournamentId, seasonId) => {
    // let match_parentId = null;

    // if (matches_parentId?.length)
    //     match_parentId = matches_parentId[Math.floor(index / 2)];

    const {
        homeTeam,
        awayTeam,
        season,
        tournament,
        id,
        winnerCode,
        roundInfo,
        status,
        startTimestamp,
        slug,
        homeScore,
        awayScore,
        customId,
    } = _.pick(match, [
        "homeTeam",
        "awayTeam",
        "homeScore",
        "awayScore",
        "season",
        "tournament",
        "id",
        "winnerCode",
        "roundInfo",
        "status",
        "startTimestamp",
        "slug",
        "customId",
    ]);
    const [fhomeTeam, fawayTeam] = await Promise.all([
        _Team
            .findOne({
                id: homeTeam.id,
            })
            .lean(),
        _Team
            .findOne({
                id: awayTeam.id,
            })
            .lean(),
    ]);

    const newMatch = {
        id: id,
        round: roundInfo.round,
        home_team: fhomeTeam?._id || null,
        away_team: fawayTeam?._id || null,
        home_team_score: homeScore ?? {},
        away_team_score: awayScore ?? {},
        tournament: tournamentId,
        season: seasonId,
        status: status, //100 end, 60: postponed, 0: not start, 50: đoán cacnel
        startTime: startTimestamp,
        slug: slug,
        winnerCode: winnerCode || null,
        customId,
    };
    return await _Match.create(newMatch);
};

const createPlayoffDocument = async (
    tournament,
    season,
    match_parentId = null,
    matchesId,
    round
) => {
    const knockoutRound = new _Playoff({
        tournament,
        season,
        matches: matchesId,
        round: round,
        round_name: getRoundPlayoff(round).name,
        next_round: getRoundPlayoff(round).next,
    });

    let rightValue;
    if (match_parentId) {
        //reply comment
        const parentKnockout = await _Playoff.findById(match_parentId);
        if (!parentKnockout)
            throw new BadRequestError("parent playoff not found");
        rightValue = parentKnockout.playoff_right;
        await _Playoff.updateMany(
            {
                tournament,
                season,
                playoff_right: { $gte: rightValue },
            },
            {
                $inc: { playoff_right: 2 },
            }
        );
        await _Playoff.updateMany(
            {
                tournament,
                season,
                playoff_left: { $gt: rightValue },
            },
            {
                $inc: { playoff_left: 2 },
            }
        );
    } else {
        const maxRightValue = await _Playoff.findOne(
            {
                tournament,
                season,
            },
            "playoff_right",
            { sort: { playoff_right: -1 } }
        );
        if (maxRightValue) {
            rightValue = maxRightValue.playoff_right + 1;
        } else {
            rightValue = 1;
        }
    }

    knockoutRound.playoff_parent = match_parentId;
    knockoutRound.playoff_left = rightValue;
    knockoutRound.playoff_right = rightValue + 1;

    await knockoutRound.save();
};

module.exports = { handlePlayoffMatchData, createPlayoffDocument, createMatch };
