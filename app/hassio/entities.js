/** @param { import('express').Express } app */
module.exports = app => {
    let options = app.hassio.config.options;
    let mqttClient = app.middlewares.connections.mqtt;
    const deviceIdPrefix = `tuya_${options.instalation}_`

    const haDevice = {
        identifiers: [
            options.tuya.deviceId
        ],
        manufacturer: 'Tuya',
        model: 'Tuya Api Node',
        name: `Tuya Api`
    }

    const getEntityTopic = (component, objectId, action) => `homeassistant/${component}/${deviceIdPrefix}${objectId}/${action}`
    const createEntity = (component, objectId, config) => {
        const extendedConfig = {
            ...config,
            object_id: `${deviceIdPrefix}${objectId}`,
            state_topic: getEntityTopic(component, objectId, 'state'),
            unique_id: `${deviceIdPrefix}${objectId}`,
            json_attributes_topic: getEntityTopic(component, objectId, 'attributes'),
            availability: {
                payload_available: 'online',
                payload_not_available: 'offline',
                topic: getEntityTopic(component, objectId, 'availability')
            },
            device: haDevice
        }
        mqttClient.publish(getEntityTopic(component, objectId, 'config'), JSON.stringify(extendedConfig))
        const updateAvailability = (isAvailable) => {
            mqttClient.publish(getEntityTopic(component, objectId, 'availability'), isAvailable ? 'online' : 'offline')
        }

        updateAvailability(true)

        const publishState = (state) => {
            mqttClient.publish(getEntityTopic(component, objectId, 'state'), String(state))
            updateAvailability(true)
        }

        const publishAttributes = (attributes) => {
            mqttClient.publish(getEntityTopic(component, objectId, 'attributes'), String(JSON.stringify(attributes)))
            updateAvailability(true)
        }

        return {
            updateAvailability,
            publishState,
            publishAttributes
        }
    }

    const doorLastOpen = createEntity('sensor', 'door_last_open', {
        icon: 'mdi:calendar-clock',
        name: 'Ultimo desbloqueio de Porta',
        device_class: 'timestamp',
    })

    const doorLastAlarm = createEntity('sensor', 'door_last_alarm', {
        icon: 'mdi:alarm-bell',
        name: 'Ultimo registro de alarme',
        device_class: 'timestamp',
    })

    return {
        doorLastOpen,
        doorLastAlarm,
    }
}
