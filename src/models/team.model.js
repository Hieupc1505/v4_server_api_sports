"use-strict";

const { convertToThumbnailUrl } = require("#utils/index");
const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Team";
const COLLECTION_NAME = "Teams";

const teamSchema = new Schema(
    {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        shortName: { type: String },
        slug: { type: String },
        logo: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

teamSchema.pre("validate", function (next) {
    this.slugify();
    next();
});

teamSchema.statics = {
    findTeam(query) {
        return this.findOne(query);
    },
};

teamSchema.methods = {
    /**
     *  Slug the title and add this to the slug prop
     */
    slugify() {
        this.slug = slugify(this.team_name);
    },
};

module.exports = model(DOCUMENT_NAME, teamSchema);
