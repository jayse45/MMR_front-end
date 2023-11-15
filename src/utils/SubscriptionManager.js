import AuthenticationManager from "./AuthenticationManager";
import ConfigurationManager from "./ConfigurationManager";
import { UrlHelper } from "./UrlHelper";

class SubscriptionManager {
	static async isUserSubscriptionExpired() {
		const subAccountTypes = ConfigurationManager.getConfig("PARENT_ACCOUNT_ROLES_ARRAY");
		const user = AuthenticationManager.getStoredUser();
		const SUBSCRIPTION_URL = UrlHelper.createApiUrlPath("/api/subscriptions/users/latest_subscriptions");
		if (user.role === "admin" || subAccountTypes.includes(user.creator.type)) {
			return false;
		}
		let res = await fetch(SUBSCRIPTION_URL, {
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				"auth-token": AuthenticationManager.getUserToken()
			}
		});
		res = await res.json();
		if (res.body && res.body.endTimestamp > Date.now()) {
			return false;
		}
		return true;
	}

	static async getLatestSubscription() {
		//return user.latest_subscription;
		const SUBSCRIPTION_URL = UrlHelper.createApiUrlPath("/api/subscriptions/users/latest_subscriptions");
		let res = await fetch(SUBSCRIPTION_URL, {
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				"auth-token": AuthenticationManager.getUserToken()
			}
		});
		res = await res.json();
		if (res.body && res.body.endTimestamp > Date.now()) {
			return res.body;
		}
		return { valid: false };
	}
}

export default SubscriptionManager;
