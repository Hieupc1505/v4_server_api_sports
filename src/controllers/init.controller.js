const { OK } = require("#helpers/success.response");
const TournamentBuilderService = require("#services/init.service");

class initController {
    static createANewTournament = async (req, res, next) => {
        try {
            const { tournament, season, rounds } = req.body;
            const tournamentBuilder = new TournamentBuilderService(
                tournament.id,
                tournament.season
            );
            const newTour = await tournamentBuilder
                .initStore()
                .then(() =>
                    tournamentBuilder.createTournament(tournament.logo || "")
                )
                .then(() => tournamentBuilder.createSeason(season))
                .then(() => tournamentBuilder.addRounds(rounds))
                .then(() => tournamentBuilder.addGroup())
                .then(() => tournamentBuilder.builder());

            new OK({
                message: "success",
                metadata: newTour,
            }).send(res);
        } catch (error) {
            console.log(error);
            next(error);
        }
    };
}

module.exports = initController;
