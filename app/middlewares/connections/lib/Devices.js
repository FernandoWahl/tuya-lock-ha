module.exports = function( )
{
	let module = { };
	
	module.init = function( dependencies )
	{
		return dependencies.baseClass.magicMethods
		( 
			class Devices
			{
				constructor( config  , token ) 
				{
					this._config = config;
					this._token = token;
					this._endpoints =
					{
						"getAppList"			:	"/v1.0/users/{appId}/devices" ,
						"getList"				:	"/v1.0/devices" ,
						"getUserList"			:	"/v1.0/users/{uid}/devices" ,
						"getDetails"			:	"/v1.0/devices/{deviceId}" ,
						"getLogs"				:	"/v1.0/devices/{deviceId}/logs" ,
						"getSubdevices"			:	"/v1.0/devices/{deviceId}/sub-devices" ,
						"getFactoryInfo"		:	"/v1.0/devices/factory-infos" ,
						"getUser"				:	"/v1.0/devices/{deviceId}/users/{user_id}" ,
						"getUsers"				:	"/v1.0/devices/{deviceId}/users" ,
						"getCategory"			:	"/v1.0/functions/{category}" ,
						"getFunctions"			:	"/v1.0/devices/{deviceId}/functions" ,
						"getSpecifications"		:	"/v1.0/devices/{deviceId}/specifications" ,
						"getStatus"				:	"/v1.0/devices/{deviceId}/status" ,
						"getMultipleNames"		:	"/v1.0/devices/{deviceId}/multiple-names" ,
						"getGroups"				:	"/v1.0/device-groups" ,
						"getGroup"				:	"/v1.0/device-groups/{groupId}" ,
						"getUserGroups"			:	"/v1.0/users/{uid}/device-groups" ,
						"putFunctioncode"		:	"/v1.0/devices/{deviceId}/functions/{functionCode}" ,
						"putResetFactory"		:	"/v1.0/devices/{deviceId}/reset-factory" ,
						"putName"				:	"/v1.0/devices/{deviceId}" ,
						"putUser"				:	"/v1.0/devices/{deviceId}/users/{user_id}" ,
						"putMultipleNames"		:	"/v1.0/devices/{deviceId}/multiple-name" ,
						"putGroup"				:	"/v1.0/device-groups/{groupId}" ,
						"postCommands"			:	"/v1.0/devices/{deviceId}/commands" ,
						"postUser"				:	"/v1.0/devices/{deviceId}/user" ,
						"postGroup"				:	"/v1.0/device-groups" ,
						"postGroupIssued"		:	"/v1.0/device-groups/{device_groupId}/issued" ,
						"postStreamAllocate"	:	"/v1.0/users/{uid}/devices/{deviceId}/stream/actions/allocate" ,
						"deleteDevice"			:	"/v1.0/devices/{deviceId}" ,
						"deleteUser"			:	"/v1.0/devices/{deviceId}/users/{user_id}" ,
						"deleteGroup"			:	"/v1.0/device-groups/{groupId}"
					}
				}
				
				endpoints( )
				{
					return this._endpoints;
				}

				__get( name ) 
				{
					let caller = new dependencies.Caller( this._config , this._endpoints , dependencies , this._token );
					return caller.send( name , arguments );
				} 
			} 
		);
	};
	return module;	
};			