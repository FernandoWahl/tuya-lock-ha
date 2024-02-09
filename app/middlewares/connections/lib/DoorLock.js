module.exports = function () {
	let module = {};

	module.init = function (dependencies) {
		return dependencies.baseClass.magicMethods
			(
				class DoorLock {
					constructor(config, token) {
						this._config = config;
						this._token = token;
						this._endpoints =
						{
							"getOpenLogs"	: "/v1.0/devices/{device_id}/door-lock/open-logs",
							"getAlarmLogs"	: "/v1.0/devices/{device_id}/door-lock/alarm-logs",
							"getRecords"	: "/v1.0/devices/{device_id}/door-lock/records",
						}
					}

					endpoints() {
						return this._endpoints;
					}

					__get(name) {
						let caller = new dependencies.Caller(this._config, this._endpoints, dependencies, this._token);
						return caller.send(name, arguments);
					}
				}
			);
	};
	return module;
};			