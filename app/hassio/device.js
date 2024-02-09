/** @param { import('express').Express } app */
module.exports = app => {

	let logger = app.middlewares.log.logger;

	this.updateDeviceState = (active) => {
		let entities = app.hassio.entities;
		entities.doorLastOpen.updateAvailability(active)
		entities.doorLastAlarm.updateAvailability(active)

		logger.debug(`device:updateDeviceState - active=${active}`);
	}

	this.updateParameters = () => {
		let entities = app.hassio.entities;
		let parser = app.hassio.parser;

		logger.debug(`device:updateParameters - Inicio da atualização`);
		
		logger.debug(`device:updateParameters:doorLastAlarm - state=${parser.doorLastAlarmParse().state}`);
		entities.doorLastAlarm.publishState(parser.doorLastAlarmParse().state)
		entities.doorLastAlarm.publishAttributes(parser.doorLastAlarmParse().attr)

		logger.debug(`device:updateParameters:doorLastOpen - state=${parser.doorLastOpenParse().state}`);
		entities.doorLastOpen.publishState(parser.doorLastOpenParse().state)
		entities.doorLastOpen.publishAttributes(parser.doorLastOpenParse().attr)

		logger.debug(`device:updateParameters - Fim da atualização`);
	}

	return this
}
