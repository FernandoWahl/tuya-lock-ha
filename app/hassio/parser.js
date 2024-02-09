const moment = require("moment");
/** @param { import('express').Express } app */
module.exports = app => {

    this.doorLastOpenParse = () => {
        let shareData = app.hassio.config.shareData;
        let data = shareData.getData();
        let currentData = data.records[0];
        return {attr: currentData, state: moment(currentData.gmt_create).toISOString()}
    }

    this.doorLastAlarmParse = () => {
        let shareData = app.hassio.config.shareData;
        let data = shareData.getData();
        let currentData = data.deviceAlarmLogs[0];
        return {attr: currentData, state: moment(currentData.update_time).toISOString()}
    }
    
    return this
}