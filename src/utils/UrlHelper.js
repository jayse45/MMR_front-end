import ConfigurationManager from "./ConfigurationManager";

class UrlHelper{
	static host = ConfigurationManager.getConfig("API_HOST");
	static app_host = ConfigurationManager.getConfig("APP_HOST");

	static createApiUrlPath(path){
		path = path[0] === "/" ? path.substring(1): path ;
		return this.host + path;
	}
	static createAppUrlPath(path) {
		path = path[0] === "/" ? path.substring(1) : path;
		return this.app_host + path;
	}
}
export { UrlHelper  };