const _Season = require("#models/season.model");
const _Tournament = require("#models/tournament.model");
const { BadRequestError } = require("#helpers/error.response");
const {
    convertToThumbnailUrl,
    convertToObjectIdMongodb,
} = require("#utils/index");
class SeasonService {
    static init = async () => {
        const query = {},
            updateSet = { $rename: { league_id: "tournament" } },
            options = { upsert: true, new: true };
        return await _Season.updateMany(query, updateSet, options);
        // return 1;
    };
    /**
     *
     * @param {number} id //id of season
     * @param {number} tour //id of tournament
     * @returns
     */
    static cloneSeason = async ({ id }) => {
        const foundSeason = await _Season
            .findOne({ id })
            .populate("tournament");

        if (!foundSeason) throw new BadRequestError("update Season error");
        foundSeason.channel = foundSeason.tournament.channelId;
        foundSeason.playlist = foundSeason.tournament.list;
        foundSeason.playlist2 = foundSeason.tournament.list2;
        foundSeason.image = foundSeason.tournament.image;
        await foundSeason.save();
        return 1;
    };

    static updateSeason = async ({ tournament, season }, body) => {
        const foundTour = await _Tournament.findOne({ id: tournament }).lean();
        if (!foundTour) throw new BadRequestError("Can not found tournament");

        const query = { tournament: foundTour._id, id: season },
            updateSet = {
                $set: body,
            },
            options = { upsert: false, new: true };
        return await _Season.findOneAndUpdate(query, updateSet, options);
    };

    static getSeason = async ({ tournament, season = null }) => {
        const foundTour = await _Tournament.findOne({ id: tournament }).lean();
        if (!foundTour)
            throw new BadRequestError(
                "Get season fail, tournament not exists!"
            );
        const query =
            season ?? false
                ? { tournament: foundTour._id }
                : {
                      tournament: foundTour._id,
                      id: season,
                  };
        const select = { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 };
        return await _Season.findOne(query).select(select);
    };

    static getListSeason = async ({ tournament }) => {
        const foundTour = await _Tournament.findOne({ id: tournament }).lean();
        if (!foundTour)
            throw new BadRequestError(
                "Get season fail, tournament not exists!"
            );
        return await _Season
            .find({
                tournament: foundTour._id,
            })
            .select({ _id: 0, id: 1, year: 1, slug: 1 })
            .lean();
    };
}

module.exports = SeasonService;
