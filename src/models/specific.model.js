"use-strict";

const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Specific";
const COLLECTION_NAME = "Specifics";

const specificSchema = new Schema(
    {
        team: { type: Schema.Types.ObjectId, ref: "Team" },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
        season: { type: Schema.Types.ObjectId, ref: "Season" },
        position: { type: Number },
        matches: { type: Number },
        wins: { type: Number },
        scoresFor: { type: Number },
        scoresAgainst: { type: Number },
        id: { type: Number },
        losses: { type: Number },
        draws: { type: Number },
        points: { type: Number },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, specificSchema);
