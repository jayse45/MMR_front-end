import jwt_decode from "jwt-decode";
class AuthenticationManager {
	static dateInSeconds() {
		return Math.trunc(Date.now() / 1000);
	}

	static decodeToken(token) {
		try {
			return jwt_decode(token);
		} catch (exp) {
			return null;
		}
	}

	static saveUserToken(token) {
		localStorage.setItem("auth-token", token);
	}

	static getUserToken() {
		return localStorage.getItem("auth-token");
	}

	static getStoredUser() {
		return this.decodeToken(this.getUserToken());
	}

	static clearUserData() {
		localStorage.clear();
	}

	static isTokenExpired() {
		const data = this.getStoredUser();
		if (data?.exp) {
			return Date.now() >= data.exp * 1000;
		}

		return true;
	}

	static checkPasswordStrength(password = "") {
		if (password.length < 8) {
			return {
				status: false,
				message: "Password must have be at least 8 characters long"
			}
		}
		if (!password.match(/.*[A-Z]/)) {
			return {
				status: false,
				message: "Password must have at least one uppercase letter"
			}
		}
		if (!password.match(/.*[a-z]/)) {
			return {
				status: false,
				message: "Password must have at least one lowercase letter"
			}
		}
		if (!password.match(/.*[0-9]/)) {
			return {
				status: false,
				message: "Password must have at least one number"
			}
		}
		if (!password.match(/.*[^A-Za-z0-9]/)) {
			return {
				status: false,
				message: "Password must have at least one special character"
			}
		}

		return {
			status: true,
			message: "Password is strong"
		}
	}
}
export default AuthenticationManager;
