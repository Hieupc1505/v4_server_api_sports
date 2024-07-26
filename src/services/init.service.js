const TournamentService = require("#services/tournament.service");
const { standings: standingsLink } = require("#utils/generateLink.util");
const { default: axios } = require("axios");

const SeasonService = require("./season.service");
const RoundService = require("./round.service");
const GroupService = require("./group.service");
class Tournament {
    constructor(builder) {
        this.tournament = builder.initTour;
        this.season = builder.initSeason;
        this.rounds = builder.initRound;
    }
}

class TournamentBuilder {
    constructor(tournament, season) {
        this.standings = [];
        this.tournament = tournament;
        this.season = season;

        this.initTour = {};
        this.initSeason = {};
        this.initRound = {};
        this.initGroup = {};
    }

    async initStore() {
        const { data } = await axios.get(
            standingsLink(this.tournament, this.season)
        );
        this.standings = data.standings;
        return this;
    }

    async createTournament(logo) {
        this.initTour = await TournamentService.initTournament({
            tourInfo: this.standings[0].tournament,
            img: logo,
            isGroup: this.standings.length > 1,
        });

        return this;
    }

    async createSeason({
        name,
        year,
        channel = null,
        playlist = null,
        img = null,
    }) {
        this.initSeason = await SeasonService.addSeason(
            this.tournament,
            this.season,
            name,
            year,
            channel,
            playlist,
            img
        );
        return this;
    }

    async addRounds({
        total,
        current,
        team_per_board,
        turn_in_board = 2,
        broze = false,
        playoff = false,
        team_in_playoff = 0,
    }) {
        this.initRound = await RoundService.addRound({
            tournament: this.tournament,
            season: this.season,
            total,
            current,
            team_per_board,
            turn_in_board,
            broze,
            playoff,
            team_in_playoff,
        });
        return this;
    }

    async addGroup() {
        await GroupService.addGroup({
            tournament: this.tournament,
            season: this.season,
        });
        return this;
    }

    builder() {
        return new Tournament(this);
    }
}

module.exports = TournamentBuilder;
