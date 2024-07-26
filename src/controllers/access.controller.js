const { OK } = require("#helpers/success.response");
const AccessService = require("#services/access.service");

class AccessController {
    static login = async (req, res, next) => {
        new OK({
            message: "login success",
            metadata: await AccessService.loginService({
                data: { user: "hieupc" },
            }),
        }).send(res);
    };
}

module.exports = AccessController;
