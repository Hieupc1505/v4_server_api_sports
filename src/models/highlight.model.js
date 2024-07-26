"use-strict";

const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Highlight";
const COLLECTION_NAME = "Highlights";

const highlightSchema = new Schema(
    {
        publishedAt: { type: Date },
        title: { type: String },
        videoId: { type: String },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
        league: { type: Schema.Types.ObjectId, ref: "Tournament" },
        season: { type: Schema.Types.ObjectId, ref: "Season" },
        thumbnail: { type: String },
        slug: { type: String },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

highlightSchema.pre("validate", function (next) {
    this.slugify();
    next();
});

highlightSchema.methods = {
    /**
     *  Slug the title and add this to the slug prop
     */
    slugify() {
        this.slug = slugify(this.title);
    },
};

module.exports = model(DOCUMENT_NAME, highlightSchema);
