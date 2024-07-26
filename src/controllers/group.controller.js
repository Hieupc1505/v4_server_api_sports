const { OK } = require("#helpers/success.response");
const GroupService = require("#services/group.service");

class GroupController {
    static updateGroup = async (req, res, next) => {
        new OK({
            message: "Update group by tournament",
            metadata: await GroupService.updateGroup(req.params),
        }).send(res);
    };
    static addGroup = async (req, res, next) => {
        new OK({
            message: "Update group by tournament",
            metadata: await GroupService.addGroup(req.params),
        }).send(res);
    };

    static standings = async (req, res, next) => {
        new OK({
            message: "Get standing tournameng",
            metadata: await GroupService.standings(req.params),
        }).send(res);
    };

    static getFiveMatch = async (req, res, next) => {
        new OK({
            message: "Get five match recently",
            metadata: await GroupService.getFiveMatchRecent(req.params),
        }).send(res);
    };
}

module.exports = GroupController;
