"use-strict";

const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Group";
const COLLECTION_NAME = "Groups";

const groupSchema = new Schema(
    {
        name: { type: String },
        id: { type: Number },
        slug: { type: String },
        season: { type: Schema.Types.ObjectId, ref: "Season" },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
        rows: [{ type: Schema.Types.ObjectId, ref: "Specific" }],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

groupSchema.pre("validate", function (next) {
    this.slugify();
    next();
});

groupSchema.methods = {
    /**
     *  Slug the title and add this to the slug prop
     */
    slugify() {
        this.slug = slugify(this.slug);
    },
};

module.exports = model(DOCUMENT_NAME, groupSchema);
