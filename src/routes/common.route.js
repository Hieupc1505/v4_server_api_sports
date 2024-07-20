const route = require("express").Router();
const TournamentController = require("#controllers/tournament.controller");
const RoundController = require("#controllers/round.controller");
const SeasonController = require("#controllers/season.controller");
const GroupController = require("#controllers/group.controller");
const SpecificController = require("#controllers/specific.controller");
const PlayoffController = require("#controllers/playoff.controller");
const HighlightController = require("#controllers/highlight.controller");

const { asyncHandler } = require("#helpers/asyncHandler.helper");
const MatchController = require("#controllers/match.controller");

route.get("/list", asyncHandler(TournamentController.getListTournament));

// route.get(
//     "/:tournament/season/:season/match",
//     asyncHandler(MatchController.updateMatch)
// );

route.get(
    "/:tournament/season/:season/standings",
    asyncHandler(GroupController.standings)
);
route.get(
    "/:tournament/season/:season/rounds",
    asyncHandler(RoundController.getRound)
);
route.get(
    "/:tournament/season/:season/match/round/:round",
    asyncHandler(MatchController.getMatchByRound)
);
route.get(
    "/:tournament/season/:season/playoff",
    asyncHandler(PlayoffController.getPlayoffMatch)
);
route.get(
    "/:tournament/season/:season/playoff/v2",
    asyncHandler(PlayoffController.getPlayoffMatchv2)
);
route.post(
    "/:tournament/season/:season/round/playoff",
    asyncHandler(PlayoffController.addPlayoffMatch)
);
route.get(
    "/:tournament/season/:season/match/update",
    asyncHandler(MatchController.updateMatchResult)
);

route.post("/search", asyncHandler(HighlightController.getVideo));

//route for admin

route.post(
    "/:tournament/season/:season/season/update",
    asyncHandler(SeasonController.updateSeason)
);

module.exports = route;
