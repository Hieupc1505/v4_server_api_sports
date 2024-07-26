"use-strict";

const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Season";
const COLLECTION_NAME = "Seasons";

const seasonSchema = new Schema(
    {
        name: { type: String },
        id: { type: Number, uinque: true },
        slug: { type: String },
        year: { type: String },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
        channel: { type: String },
        playlist: { type: String },
        playlist2: { type: String },
        image: { type: String }, //iamge for highlight match
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

seasonSchema.pre("validate", function (next) {
    this.slugify();
    next();
});

seasonSchema.methods = {
    /**
     *  Slug the title and add this to the slug prop
     */
    slugify() {
        this.slug = slugify(this.name);
    },
};

module.exports = model(DOCUMENT_NAME, seasonSchema);
