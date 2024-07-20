const { BadRequestError } = require("#helpers/error.response");
const _Tournament = require("#models/tournament.model");

const { convertToThumbnailUrl } = require("#utils/index");
class TournamentService {
    static initTournament = async () => {
        // const leagues = await League2.find().lean();
        // for (let league of leagues) {
        //     const tour = new _Tournament({
        //         tour_name: league.name,
        //         tour_id: league.id,
        //         tour_slug: league.slug,
        //         tour_logo: league.logo,
        //         tour_thumbnail: convertToThumbnailUrl(league.logo),
        //         tour_img: league.image,
        //         tour_img_thumbnail: convertToThumbnailUrl(league.image),
        //     });
        //     await tour.save();
        // }
        // return 1;
        return await _Tournament.updateMany(
            {},
            {
                $unset: {
                    channelId: "",
                    list: "",
                    list2: "",
                    image: "",
                },
            }
        );
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
