import config from '../config'
class ConfigurationManager {
	static getConfig(key){
		return config[key];
	}
}

export default ConfigurationManager;