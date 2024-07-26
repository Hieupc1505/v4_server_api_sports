const { BadRequestError } = require("#helpers/error.response");
const _Tournament = require("#models/tournament.model");
const _ = require("lodash");

const { convertToThumbnailUrl } = require("#utils/index");
const { uploadImageLink } = require("./upload.service");
class TournamentService {
    static initTournament = async ({ tourInfo, img, isGroup = false }) => {
        const selectFieldTour = ["uniqueTournament", "category"];
        const { uniqueTournament, category } = _.pick(
            tourInfo,
            selectFieldTour
        );
        const foundTour = await _Tournament.findTour({
            id: uniqueTournament.id,
        });
        if (foundTour) {
            return foundTour;
        }

        const logo = await uploadImageLink(img);

        return await _Tournament.create({
            id: uniqueTournament.id,
            name: uniqueTournament.name,
            country: category.name,
            isGroup,
            logo,
        });
    };

    static getInfoTournament = async ({ id }) => {
        const foundTour = await _Tournament.findOne({ id }).lean();

        if (!foundTour)
            throw new BadRequestError("Can not get Info Tournament");

        return foundTour;
    };

    static getListTournament = async () => {
        return await _Tournament
            .find()
            .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0 })
            .lean();
    };
}

module.exports = TournamentService;
