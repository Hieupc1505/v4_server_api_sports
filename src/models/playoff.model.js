"use-strict";
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Playoff";
const COLLECTION_NAME = "Playoffs";

const PlayoffSchema = new Schema(
    {
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
        //query sửa phải để ý vì nó đang là giá trị của specifics
        season: { type: Schema.Types.ObjectId, ref: "Season" },
        match: { type: Schema.Types.ObjectId, ref: "Match" },
        matches: [{ type: Schema.Types.ObjectId, ref: "Match" }],
        round: { type: Number },
        round_name: { type: String },
        next_round: { type: String },
        playoff_parent: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME },
        playoff_left: { type: Number },
        playoff_right: { type: Number },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, PlayoffSchema);
