const Log = require('logger')
const bodyParser = require('body-parser');
const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
	start() {
		this.expressApp.use(bodyParser.json());
		this.expressApp.post('/remote-nest-thermostat', (req, res) => {
			const params = req.body;

			Log.log(`MMM-NestRemoteThermostat Node helper: New message received: `);
			Log.log(JSON.stringify(params, null, 4))

			const payload = {
				thermostatId: params.thermostatId,
				targetTemperature: params.targetTemperature,
				ambientTemperature: params.ambientTemperature,
				state: params.state.toLowerCase(),
				power: params.power,
				icon: params.icon.toLowerCase(),
				loading: typeof params.loading == "boolean" ? params.loading : params.loading == "True"
			};

			res.send({"status": "success", "payload": payload,});

			this.sendSocketNotification('MMM-NestRemoteThermostat.VALUE_RECEIVED', payload);
		});
	},

	socketNotificationReceived(notificationName, payload) {
		if (notificationName === 'MMM-NestRemoteThermostat.INIT') {
			Log.log(`MMM-NestRemoteThermostat Node helper: Init notification received from module for thermostat "${payload.thermostatId}".`); // eslint-disable-line no-console
		}
	},
});
