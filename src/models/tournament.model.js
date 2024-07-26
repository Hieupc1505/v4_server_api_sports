"use-strict";

const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const COLLECTION_NAME = "Tournaments";
const DOCUMENT_NAME = "Tournament";

const tournamentSchema = new Schema(
    {
        name: { type: String },
        id: { type: Number, uinque: true },
        slug: { type: String },
        isGroup: { type: Boolean, default: false },
        logo: { type: String, required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

tournamentSchema.pre("validate", function (next) {
    this.slugify();
    next();
});

tournamentSchema.methods = {
    /**
     *  Slug the title and add this to the slug prop
     */
    slugify() {
        this.slug = slugify(this.name);
    },
};

tournamentSchema.statics = {
    async findTour(
        query,
        select = { _id: 1, id: 1, name: 1, slug: 1, logo: 1, isGroup: 1 }
    ) {
        return this.findOne(query).select(select).lean();
    },
};

module.exports = model(DOCUMENT_NAME, tournamentSchema);
