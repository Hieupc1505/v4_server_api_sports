const _Tournament = require("#models/tournament.model");
const _Season = require("#models/season.model");
const { BadRequestError } = require("#helpers/error.response");

const getTourAndSeasonById = async (tour, season) => {
    const [foundTour, foundSeason] = await Promise.allSettled([
        _Tournament.findOne({ id: tour }).lean(),
        _Season.findOne({ id: season }).lean(),
    ]);

    if (!foundTour.value || !foundSeason.value) {
        throw new BadRequestError("Can not find tournament or season");
    }

    return [foundTour.value, foundSeason.value];
};

module.exports = {
    getTourAndSeasonById,
};
