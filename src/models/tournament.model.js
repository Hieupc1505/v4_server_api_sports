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

module.exports = model(DOCUMENT_NAME, tournamentSchema);
