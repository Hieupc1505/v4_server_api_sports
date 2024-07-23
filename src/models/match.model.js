"use-strict";

const { convertToObjectIdMongodb } = require("#utils/index");
const { model, Schema } = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Match";
const COLLECTION_NAME = "Matches";

const matchSchema = new Schema(
    {
        id: { type: Number },
        status: {
            type: Object,
        },
        startTime: { type: Number },
        slug: { type: String },
        winnerCode: { type: Number },
        customId: { type: String },
        highlight: { type: Schema.Types.ObjectId, ref: "Highlight" },
        home_team: { type: Schema.Types.ObjectId, ref: "Team" },
        away_team: { type: Schema.Types.ObjectId, ref: "Team" },
        home_team_id: { type: Schema.Types.ObjectId, ref: "Team" },
        away_team_id: { type: Schema.Types.ObjectId, ref: "Team" },
        tournament: { type: Schema.Types.ObjectId, ref: "Tournament" },
        season: { type: Schema.Types.ObjectId, ref: "Season" },
        round: { type: Number },
        home_team_score: {
            current: { type: Number },
            display: { type: Number },
            period1: { type: Number },
            period2: { type: Number },
            normaltime: { type: Number },
            extra1: { type: Number },
            extra2: { type: Number },
            overtime: { type: Number },
            penalties: { type: Number },
        },
        away_team_score: {
            current: { type: Number },
            display: { type: Number },
            period1: { type: Number },
            period2: { type: Number },
            normaltime: { type: Number },
            extra1: { type: Number },
            extra2: { type: Number },
            overtime: { type: Number },
            penalties: { type: Number },
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

matchSchema.pre("validate", function (next) {
    this.slugify();
    next();
});

matchSchema.statics = {
    getResultFiveMatchRecently(
        tournament,
        season,
        team_id,
        time,
        populate = []
    ) {
        return this.find({
            tournament: tournament,
            season: season,
            startTime: { $lte: time },
            $or: [{ home_team: team_id }, { away_team: team_id }],
        })
            .populate(populate)
            .sort({ startTime: -1 })
            .limit(5)
            .lean();
    },
    getResultFiveMatchRecentlyWithTeamId(
        tournament,
        season,
        team_id,
        time,
        populate = []
    ) {
        return this.find({
            tournament: tournament,
            season: season,
            startTime: { $lte: time },
            $or: [{ home_team: team_id }, { away_team: team_id }],
        })
            .populate(populate)
            .sort({ startTime: -1 })
            .limit(5)
            .lean();
    },
};

matchSchema.methods = {
    /**
     *  Slug the title and add this to the slug prop
     */
    slugify() {
        this.slug = slugify(this.slug);
    },
};

module.exports = model(DOCUMENT_NAME, matchSchema);
