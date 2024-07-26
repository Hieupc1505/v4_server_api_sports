const { OK } = require("#helpers/success.response");
const SpecificController = require("#services/specific.service");

class Specific {
    static getSpecific = async (req, res, next) => {
        new OK({
            message: "Get Specific by tournament",
            metadata: await SpecificController.initSpercific(),
        }).send(res);
    };
}

module.exports = Specific;
