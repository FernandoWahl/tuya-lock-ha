const TuyaCloud = require("./lib/TuyaCloud")

/** @param { import('express').Express } app */
module.exports = app => {
    let options = app.hassio.config.options
    let axios = app.middlewares.globals.axios
    
    return new TuyaCloud({
        "clientSecret": options.tuya.clientSecret,
        "clientId": options.tuya.clientId,
        "server": options.tuya.url,
        "axios": axios
    })
}