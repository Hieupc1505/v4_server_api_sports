"use-strict";

const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const COLLECTION_NAME = "Rounds";
const DOCUMENT_NAME = "Round";

const roundSchema = new Schema(
    {
        total: { type: Number, required: true }, //tong số đội giải đấu
        current: { type: Number }, //round hiện tại giải đấu
        season: { type: Schema.Types.ObjectId, ref: "Season" },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
        playoff: { type: Boolean, default: false }, //giải đấu có play off không
        broze: { type: Boolean, default: false }, //có tranh hạng 3 khoong
        team_in_playoff: { type: Number }, //number of team in knockout
        team_per_board: { type: Number, required: true }, //so doi moi bảng
        turn_in_board: { type: Number, enum: [1, 2] }, //so luot vong bang
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = model(DOCUMENT_NAME, roundSchema);
