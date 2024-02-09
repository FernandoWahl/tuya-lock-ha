/** @param { import('express').Express } app */
module.exports = app => {
    const { tuya: controller } = app.controllers;
    const prefix = process.env.APP_PREFIX;

    app.get(`${prefix}/device/:id([0-9Aa-z]+)`, controller.getDevice);
    app.get(`${prefix}/device/:id([0-9Aa-z]+)/logs`, controller.getDeviceLogs);
    app.get(`${prefix}/device/:id([0-9Aa-z]+)/alarmlogs`, controller.getDeviceAlarmLogs);
    app.get(`${prefix}/device/:id([0-9Aa-z]+)/records`, controller.getRecords);

    return this;
};