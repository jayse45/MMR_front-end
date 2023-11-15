export default class StorageManager {
	static #STORE = localStorage
	static get(key) {
		return this.#STORE.getItem(key);
	}
	static set(key, value){
		return this.#STORE.setItem(key, value);
	}
}