/** @param { import('express').Express } app */
module.exports = app => {
    const {options, shareData} = app.hassio.config
    const {log, connections} = app.middlewares

    const logger = log.logger;
    const mqttClient = connections.mqtt;

    mqttClient.on("connect", () => {
        logger.debug(`MQTT Connected success!`);

        const update = (retries = 0) => {
            logger.debug(`hassio:update retries=${retries}`)
            const {device, tuyaApi} = app.hassio
            tuyaApi.getAllData()
                .then(result => shareData.setData(result))
                .then(() => device.updateParameters())
                .catch(error => {
                    logger.debug(`hassio:error`, error)
                    if (retries < 5) {
                        return setTimeout(() => {
                            update(retries + 1)
                        }, 10000 * (retries + 1))
                    } else {
                        device.updateDeviceState(false)
                    }
                });

        }
        update()
        setInterval(update, options.update_interval * 1000)
    });
}