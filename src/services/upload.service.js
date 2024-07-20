const cloudinary = require("../loaders/cloudinary");
const {
    InternalserverError,
    BadRequestError,
} = require("#helpers/error.response");
const { env } = require("#configs/constants.config");
var that = (module.exports = {
    uploadImage: async (id, type = "tournament") => {
        if (!id) createError(400, "Tournament ID is required");
        else {
            const links = {
                tournament: (l) =>
                    `https://api.sofascore.app/api/v1/unique-tournament/${l}/image/dark`,
                team: (t) => `https://api.sofascore.app/api/v1/team/${t}/image`,
            };
            try {
                const result = await cloudinary.uploader.upload(
                    links[type](id),
                    {
                        folder: env.cloud.folder,
                    }
                );
                return result.secure_url;
            } catch (error) {
                return new InternalserverError("Upload Imge Fail");
            }
        }
    },
    uploadImageLink: async (link) => {
        if (!link) BadRequestError("Link is requied");
        else {
            try {
                const result = await cloudinary.uploader.upload(link, {
                    folder: env.cloud.folder,
                });
                return result.secure_url;
            } catch (error) {
                return new InternalserverError("Upload image with link fail");
            }
        }
    },
});
