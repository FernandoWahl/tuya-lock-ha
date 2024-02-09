module.exports = class Caller {
	constructor(config, endpoints, dependencies, token) {
		this._config = config;
		this._endpoints = endpoints;
		this._token = token;
		this.dependencies = dependencies;
	}

	send(name) {
		if (!this._endpoints.hasOwnProperty(name)) {
			return function () {
				throw new Error("Method '" + name + "' is not supported!");
			}
		}
		return function () {
			let method = name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').split('_')[0].toUpperCase();
			let payload = '';
			let sign_headers = '';
			let uri = this._endpoints[name];
			if (Object.keys(arguments).length !== 0) {
				for (const [key, value] of Object.entries(arguments)) {
					if (typeof value === 'object' && value.type == "query") {
						delete value.type
						let entries = Object.entries(Object.keys(value).sort().reduce(
							(obj, key) => {
								obj[key] = value[key];
								return obj;
							},
							{}
						))
						uri += "?"
						for (const [k, v] of entries) {
							uri += k + "=" + v + "&"
						}
						uri = uri.slice(0, -1);
					}
					else if (typeof value === 'object' && value.type == "body") {
						delete value.type
						payload = value;
					}
					else {
						uri = uri.replace(/{.*?}/, value);
					}
				}
			}
			let request = this.dependencies.Request(this._config, this.dependencies);
			return request.call(uri, method, this._token, payload, sign_headers);

		}.bind(this);
	}
};