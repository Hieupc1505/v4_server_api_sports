"use-strict";

const HighlightService = require("#services/highlight.service");
const { OK } = require("#helpers/success.response");

class HighlightController {
    static async updateHighlight(req, res, next) {
        new OK({
            message: "updateHighlight success",
            metadata: await HighlightService.init(),
        }).send(res);
    }
    static async getVideo(req, res, next) {
        new OK({
            message: "Get video success",
            metadata: await HighlightService.getVideo(req.body),
        }).send(res);
    }
}

module.exports = HighlightController;
