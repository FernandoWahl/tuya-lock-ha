/** @param { import('express').Express } app */
module.exports = app => {
    let logger = app.middlewares.log.logger;
    let options = app.hassio.config.options;
    let serviceTuya = app.services.tuya;

    this.getAllData = () => {
        return new Promise((resolve, reject) => {
            var id = options.tuya.deviceId;

            let records = serviceTuya.getRecords(id);
            let deviceAlarmLogs = serviceTuya.getDeviceAlarmLogs(id);
            logger.debug(`tuyaApi:getAllData - Inicio da busca de dados `)
            Promise.all([records, deviceAlarmLogs]).then(values => {
                logger.debug(`tuyaApi:getAllData - Dados obtidos com sucesso`)
                resolve({ records: values[0].records, deviceAlarmLogs: values[1].records })
            }).catch(function (error) {
                logger.error("tuyaApi:getAllData:error", error);
                reject(error?.message || error)
            });;
        })
    }
    return this
}