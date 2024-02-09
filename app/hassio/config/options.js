const fs = require("fs");
const isProduction = process.env.NODE_ENV === "production"
const rawOptions = fs.readFileSync(isProduction ? '/data/options.json' : './options-mock.json', 'utf8');

/** @param { import('express').Express } app */
module.exports = app => {
    const optionsFromfile = JSON.parse(rawOptions)
    let options = {
        tuya: {
            url: optionsFromfile.tuya_url,
            clientId: optionsFromfile.tuya_client_id,
            clientSecret: optionsFromfile.tuya_client_secret,
            deviceId: optionsFromfile.tuya_device_id,
        },
        mqtt: {
            host: optionsFromfile.mqtt_host,
            user: optionsFromfile.mqtt_user,
            password: optionsFromfile.mqtt_password,
        },
        update_interval: optionsFromfile.update_interval
    }
    return options
};