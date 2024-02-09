const moment = require("moment");

/** @param { import('express').Express } app */
module.exports = app => {
    const logger = app.middlewares.log.logger;
    const TuyaCloud = app.middlewares.connections.tuyaCloud;

    const getUnix = (days, plus = false) => {
        const m = moment();
        if (days) {
            plus ? m.add(days, 'days') : m.subtract(days, 'days');
        }
        return parseFloat(m.format('x'));
    };

    const getDateFromUnix = unix => moment(unix).format('YYYY-MM-DDTHH:mm:ss');
    const getDateFromUnixNoTimestemp = unix => moment(parseFloat(`${unix}000`)).format('YYYY-MM-DDTHH:mm:ss');

    const processDeviceDetails = response => {
        response.active_time = getDateFromUnix(getDateFromUnixNoTimestemp(response.active_time));
        response.create_time = getDateFromUnix(getDateFromUnixNoTimestemp(response.create_time));
        response.update_time = getDateFromUnix(getDateFromUnixNoTimestemp(response.update_time));
        response.icon = `https://images.tuyaus.com/${response.icon}`;
        return response;
    };

    const processLogs = logs => {
        return logs.map(log => {
            log.update_time = getDateFromUnix(log.update_time);
            return log;
        });
    };

    const processRecords = records => {
        return records.map(record => {
            record.gmt_create = getDateFromUnix(record.gmt_create);
            return record;
        });
    };

    this.getDevice = async (id) => {
        try {
            logger.debug("service:getDevice:id", id);

            const tokenData = await TuyaCloud.token().getNew();
            const deviceData = await TuyaCloud.devices(tokenData.result.access_token).getDetails(id);
            const response = processDeviceDetails(deviceData.result);

            return response;
        } catch (err) {
            logger.error(`tuya:getDevice:error`, err?.message || err);
            throw err;
        }
    };

    this.getDeviceLogs = async (id) => {
        try {
            logger.debug("service:getDeviceLogs:id", id);
            const tokenData = await TuyaCloud.token().getNew();
            const data = await TuyaCloud.doorLock(tokenData.result.access_token).getOpenLogs(id, {
                "type": "query",
                "page_no": 1,
                "page_size": 100,
                "start_time": getUnix(7),
                "end_time": getUnix()
            });
            const response = {
                ...data.result,
                logs: processLogs(data.result.logs)
            };

            return response;
        } catch (err) {
            logger.error(`tuya:getDeviceLogs:error`, err?.message || err);
            throw err;
        }
    };

    this.getDeviceAlarmLogs = async (id) => {
        try {
            logger.debug("service:getDeviceLogs:id", id);
            const tokenData = await TuyaCloud.token().getNew();
            const data = await TuyaCloud.doorLock(tokenData.result.access_token).getAlarmLogs(id, {
                "type": "query",
                "page_no": 1,
                "page_size": 100,
                "codes": "alarm_lock,doorbell,hijack"
            });
            const response = {
                ...data.result,
                records: processLogs(data.result.records)
            };

            return response;
        } catch (err) {
            logger.error(`tuya:getDeviceLogs:error`, err?.message || err);
            throw err;
        }
    };

    this.getRecords = async (id) => {
        try {
            logger.debug("service:getDeviceLogs:id", id);
            const tokenData = await TuyaCloud.token().getNew();
            const data = await TuyaCloud.doorLock(tokenData.result.access_token).getRecords(id, {
                "type": "query",
                "targetStandardDpCodes": "unlock_password,unlock_card,unlock_fingerprint,unlock_temporary,wrong_finger",
                "startTime": getUnix(7),
                "endTime": getUnix(),
                "pageNo": 1,
                "pageSize": 100
            });
            const response = {
                ...data.result,
                records: processRecords(data.result.records)
            };

            return response;
        } catch (err) {
            logger.error(`tuya:getDeviceLogs:error`, err?.message || err);
            throw err;
        }
    };

    return this;
};