const { Types } = require("mongoose");
const _Match = require("#models/match.model");
const _Playoff = require("#models/playoff.model");
const _ = require("lodash");
const { env } = require("#configs/constants.config");
const axios = require("axios");
function convertToThumbnailUrl(url) {
    const transformation = "c_thumb,w_200,g_face";
    const regex = /\/upload\/(v\d+\/.*)/;
    return url ? url.replace(regex, `/upload/${transformation}/$1`) : "";
}

// Hàm để trích xuất filename từ stack trace
function extractFilenameFromStack(stack) {
    const stackLines = stack.split("\n");
    const context = stackLines[1];

    if (!context) return "/src/index";
    return context.trim().replace(process.cwd(), "");
}

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

function numRounds(team_per_board, turn_in_board = 1) {
    if (team_per_board % 2 === 0) {
        // even number of team_per_board
        return (team_per_board - 1) * turn_in_board;
    } else {
        throw new Error("Number of team_per_board must be even");
    }
}

function numRoundKnockout(teams) {
    if (teams <= 0) {
        throw new Error("Number of teams must be positive");
    }
    if (teams % 2 !== 0) {
        throw new Error("Number of teams must be even");
    }
    let rounds = 0;
    while (teams > 1) {
        teams /= 2;
        rounds++;
    }
    return rounds;
}

function removeLastThreeDigits(num) {
    return Math.floor(num / 1000);
}

const getFiveMatchRecent = async (tournament, season, group) => {
    let time = removeLastThreeDigits(new Date().getTime());
    let tmp = {};
    for (let specific of group.rows) {
        let historyMatch = await _Match.getResultFiveMatchRecently(
            tournament,
            season,
            specific.team._id,
            time
        );
        // console.log(historyMatch);

        const result = convertFiveMatch(historyMatch, specific.team._id);

        tmp = { ...tmp, [specific.team.id.toString()]: result };
    }
    return tmp;
};

const convertFiveMatch = (matches, teamId) => {
    return matches.map((match) => {
        // console.log(match.winnerCode, match.home_team_id.toString() === teamId.toString())
        if (match.status.code !== 0 || match.status.code >= 100) {
            if (
                match.winnerCode === 1 &&
                match.home_team.toString() === teamId.toString()
            ) {
                return 1;
            } else if (
                match.winnerCode === 1 &&
                match.home_team.toString() !== teamId.toString()
            ) {
                return 0;
            } else if (
                match.winnerCode === 2 &&
                match.home_team.toString() === teamId.toString()
            ) {
                return 0;
            } else if (
                match.winnerCode === 2 &&
                match.home_team.toString() !== teamId.toString()
            ) {
                return 1;
            } else {
                return 2;
            }
        } else return 3;
    });
};
const findResultFiveMatchRecently = (
    winnerCode,
    status = {},
    home_team_id,
    teamId
) => {
    // console.log(match.winnerCode, match.home_team_id.toString() === teamId.toString())
    if (status?.code !== 0 || status?.code >= 100) {
        if (winnerCode === 1 && home_team_id === teamId) {
            return 1;
        } else if (winnerCode === 1 && home_team_id !== teamId) {
            return 0;
        } else if (winnerCode === 2 && home_team_id === teamId) {
            return 0;
        } else if (winnerCode === 2 && home_team_id !== teamId) {
            return 1;
        } else {
            return 2;
        }
    } else return 3;
};

const getDetailFiveMatch = (matches, teamId) => {
    return matches.map((match) => {
        const {
            home_team,
            away_team,
            home_team_score,
            away_team_score,
            winnerCode,
            status,
        } = _.pick(match, [
            "home_team",
            "away_team",
            "home_team_score",
            "away_team_score",
            "status",
            "winnerCode",
        ]);

        return {
            result: findResultFiveMatchRecently(
                winnerCode,
                status,
                +home_team.id,
                +teamId
            ),
            slug: `${home_team.shortName} ${home_team_score.display} - ${away_team_score.display} ${away_team.shortName}`,
        };
    });
};

const handleRoundCup = {
    ["round-of-16"]: {
        name: "round-of-16",
        previous: null,
        next: "quarterfinals",
        round: 5,
        length: 8,
    },
    ["quarterfinals"]: {
        name: "quarterfinals",
        previous: "round-of-16",
        next: "semifinals",
        round: 27,
        length: 4,
    },
    ["semifinals"]: {
        name: "semifinals",
        previous: "quarterfinals",
        next: "final",
        round: 28,
        length: 2,
    },
    ["final"]: {
        name: "final",
        previous: "semifinals",
        next: null,
        round: 29,
        length: 1,
    },
    ["broze"]: {
        round: 50,
        name: "match-for-3rd-place",
        next: null,
        previous: "semifinals",
    },
};

const getRoundPlayoff = (round) => {
    switch (round) {
        case "round-of-16":
        case 5:
            return handleRoundCup["round-of-16"];

        case "quarterfinals":
        case 27:
            return handleRoundCup["quarterfinals"];

        case "semifinals":
        case 28:
            return handleRoundCup["semifinals"];

        case "final":
        case 29:
            return handleRoundCup["final"];
        case "match-for-3rd-place":
        case 50:
            return handleRoundCup["broze"];
    }
};

const getParentMatchId = async (matchId, matches_parentId = null) => {
    const parents = matches_parentId
        ? await Promise.all(
              matches_parentId.map((item) =>
                  _Playoff.findById(item).populate(["matches"]).lean()
              )
          )
        : null;

    const matchQuery = await _Match
        .findById(matchId)
        .populate(["home_team", "away_team"])
        .lean();
    const home_team = _.get(matchQuery, "homeTeam._id");
    const away_team = _.get(matchQuery, "awayTeam._id");

    if (matches_parentId.length === 1) return parents[0]._id;
    const foundParent = parents.filter(
        (item) =>
            item.match?.home_team?.toString() === home_team.toString() ||
            item.match?.home_team?.toString() === away_team.toString() ||
            item.match?.away_team?.toString() === home_team.toString() ||
            item.match?.away_team?.toString() === away_team.toString()
    );

    return foundParent.length ? foundParent[0]._id : null;
};

const convertTimeToInt = (day) => {
    return Math.floor(
        (new Date().getTime() + day * 24 * 60 * 60 * 1000) / 1000
    );
};

function getUrl(channel, q) {
    var mykey = env.ytb.key,
        URL = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel}&maxResults=4&q=${q}&regionCode=VN&key=${mykey}`;

    return URL;
}

function compareTimeGte(t, u) {
    return new Date(t) >= new Date(u);
}

const getVideoFromYTB = async (q, t, channel) => {
    const { data } = await axios(getUrl(channel, q));

    const result = data.items.filter((item) =>
        compareTimeGte(item.snippet.publishedAt, t)
    );
    return result.length ? result[0] : null;
};
module.exports = {
    convertToThumbnailUrl,
    convertToObjectIdMongodb,
    extractFilenameFromStack,
    numRounds,
    numRoundKnockout,
    removeLastThreeDigits,
    getFiveMatchRecent,
    convertFiveMatch,
    getRoundPlayoff,
    getParentMatchId,
    convertTimeToInt,
    getVideoFromYTB,
    getDetailFiveMatch,
};
