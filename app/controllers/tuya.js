const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
};

/** @param { import('express').Express } app */
module.exports = app => {
    const service = app.services.tuya;

    const handlePromise = (promise, res, next) => {
        promise
            .then(result => res.status(HTTP_STATUS.OK).send(result))
            .catch(err => {
                const error = new Error(err.message || err);
                error.status = HTTP_STATUS.BAD_REQUEST;
                next(error);
            });
    };

    this.getDevice = (req, res, next) => {
        const id = req.params.id;
        handlePromise(service.getDevice(id), res, next);
    };

    this.getDeviceLogs = (req, res, next) => {
        const id = req.params.id;
        handlePromise(service.getDeviceLogs(id), res, next);
    };

    this.getDeviceAlarmLogs = (req, res, next) => {
        const id = req.params.id;
        handlePromise(service.getDeviceAlarmLogs(id), res, next);
    };

    this.getRecords = (req, res, next) => {
        const id = req.params.id;
        handlePromise(service.getRecords(id), res, next);
    };

    return this;
};
