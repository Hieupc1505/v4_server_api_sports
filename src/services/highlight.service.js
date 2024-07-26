const _Highlight = require("#models/highlight.model");
const _Season = require("#models/season.model");
const _Match = require("#models/match.model");
const { getVideoFromYTB } = require("#utils/index");
const axios = require("axios");

class HighlightService {
    static init = async () => {
        // await _Highlight.updateMany({}, { $rename: { league: "tournament" } });
        return 1;
    };
    static getVideo = async ({
        season,
        query,
        t,
        matchid,
        slug = null,
        day = -5,
    }) => {
        let time = new Date(t * 1000 + day * 24 * 60 * 60 * 1000).toISOString();
        const foundSeason = await _Season.findOne({ id: season });
        if (!foundSeason.channel) return null;
        const q = slug ? slug : query;
        const result = await getVideoFromYTB(q, time, foundSeason.channel);
        if (result) {
            let hl = await _Highlight.findOne({
                videoId: result.id.videoId,
            });
            if (!hl) {
                hl = await _Highlight.create({
                    tournament: foundSeason._id,
                    title: result.snippet.title,
                    videoId: result.id.videoId,
                    publishedAt: new Date(result.snippet.publishedAt).getTime(),
                });
            }

            await _Match.findOneAndUpdate(
                {
                    id: matchid,
                },
                {
                    $set: {
                        highlight: hl._id,
                    },
                },
                { upsert: false }
            );
            return result.id.videoId;
        }
        return null;
    };
}

module.exports = HighlightService;
