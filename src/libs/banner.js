const { env } = require("#configs/constants.config");

module.exports = (log) => {
    if (env.app.banner) {
        const route = () => `${env.db.host}`;
        log.info(``);
        log.info(`Sheeh, your app is ready on ${route}${env.app.routePrefix}`);
        log.info(`To shut it down, press <CTRL> + C at any time.`);
        log.info(``);
        log.info("-------------------------------------------------------");
        log.info(`Environment  : ${env.node}`);
        log.info(`Version      : ${env.app?.version} || 1.0.0`);
        log.info(``);
        log.info(`API Info     : ${route}${env.app.routePrefix}`);

        log.info("-------------------------------------------------------");
        log.info("");
    } else {
        log.info(`Application is up and running.`);
    }
};
