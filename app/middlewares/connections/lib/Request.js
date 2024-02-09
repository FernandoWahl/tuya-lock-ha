module.exports = function (config, dependencies) {
	let module = {};

	module._crypto = function () {
		return dependencies.crypto;
	}

	module._time = function (second) {
		let t = new Date();
		t.setSeconds(t.getSeconds() + second);
		return t.getTime();
	}

	module._calcSignToken = function (clientId, accessToken, timestamp, nonce, signStr, secret) {
		let str = clientId + accessToken + timestamp + nonce + signStr;
		let hash = this._crypto().createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase()
		let hashInBase64 = hash.toString();
		let signUp = hashInBase64.toUpperCase();
		return signUp;
	}

	module._calcSign = function (clientId, timestamp, nonce, signStr, secret) {
		let str = clientId + timestamp + nonce + signStr;
		let hash = this._crypto().createHmac('sha256', secret).update(str, 'utf8').digest('hex').toUpperCase()
		let hashInBase64 = hash.toString();
		let signUp = hashInBase64.toUpperCase();
		return signUp;
	}

	module._validateToken = function (time) {
		let now = new Date();
		let expire = new Date(time);
		return expire.getTime() > now.getTime();
	}


	module.call = function (uri, method, token, payload, sigHeaders) {
		let stringPayload = (payload) ? JSON.stringify(payload) : '';
		let timestamp = Date.now().toString();
		let contentHash = this._crypto().createHash('sha256').update(stringPayload).digest('hex');
		let stringToSign = method + "\n" + contentHash + "\n" + '' + "\n" + uri;
		let sign = this._calcSign(config.clientId, timestamp, '', stringToSign, config.clientSecret);

		if (token) {
			sign = this._calcSignToken(config.clientId, token, timestamp, '', stringToSign, config.clientSecret);
		}

		let headers =
		{
			't': timestamp,
			'sign_method': 'HMAC-SHA256',
			'Accept': 'Accept: application/json, text/plan',
			'client_id': config.clientId,
			'User-Agent': 'tuyacloudnodejs',
			'Content-Length': payload.length,
			'sign': sign
		};
		if (token) {
			headers.access_token = token;
		}
		let request = {
			url: uri,
			method: method,
			baseURL: config.server,
			headers: headers,
			responseType: 'json'

		};
		return new Promise(async (resolve, reject) => {
			let save = await dependencies.fs.load();
			if (token || !token && !save.access_token || !token && !save.access_token && module._validateToken()) {
				dependencies.axiosHandler.request(request).then(async (result) => {
					if (result.data?.success) {
						if (result.data.result.access_token) {
							let auth = result.data.result
							await dependencies.fs.save({
								access_token: auth.access_token,
								expire_time: auth.expire_time,
								refresh_token: auth.refresh_token,
								time: module._time(auth.expire_time)
							})
						}
						resolve(result.data)
					}
					await dependencies.fs.save({})
					reject(new Error(`${result.data.code} - ${result.data.msg}`, {
						"code": result.status,
						"data": result.data
					}))
				})
			} else {
				resolve({
					result: {
						access_token: save.access_token,
						expire_time: save.expire_time,
						refresh_token: save.refresh_token
					},
					success: true
				})
			}
		});
	};

	return module;
};