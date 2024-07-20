const _Specific = require("#models/specific.model");
const { getTourAndSeasonById } = require("#utils/getTourAndSeason.util");

class SpecificService {
    static initSpercific = async () => {
        const [foundTour, foundSeason] = await getTourAndSeasonById(
            tournament,
            season
        );
        return await _Specific.deleteMany({
            tournament: foundTour._id,
            scoresFor: { $exists: false },
        });
    };
}

module.exports = SpecificService;
