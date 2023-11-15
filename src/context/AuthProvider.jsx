import { createContext, useState } from 'react';
import AuthenticationManager from '../utils/AuthenticationManager';
import { UrlHelper } from '../utils/UrlHelper';
import NotificationManager from '../utils/NotificationManager';
import StorageManager from '../utils/StorageManager';
import CONFIG from '../config';


const LOGIN_URL = UrlHelper.createApiUrlPath("/api/users/login");
const REGISTER_URL = UrlHelper.createApiUrlPath("/api/users/register");
const ADMIN_LOGIN_URL = UrlHelper.createApiUrlPath("/api/admins/login");

const AuthContext = createContext({});

export function AuthProvider({ children }) {

	const [openModal, setOpenModal] = useState(false);
	const [openModalButton, setOpenModalButton] = useState(false);
	const getUser = () => AuthenticationManager.getStoredUser();
	const getToken = () => AuthenticationManager.getUserToken();

	const signIn = ({ email, password, remember, userType = "", success_cb = () => {/*empty to prevent null calls*/ }, failure_cb = () => {/*empty to prevent null calls*/ }, catch_cb = (err) => { } }) => {
		const data = {
			email,
			password,
			remember
		};
		fetch(userType === "admin" ? ADMIN_LOGIN_URL : LOGIN_URL, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			}
		}).then(response => response.json())
			.then((data) => {
				if (data.status === 200) {
					const user = AuthenticationManager.getStoredUser()
					AuthenticationManager.saveUserToken(data.token);
					if (user?.role === CONFIG.ROLES.HEALTH_PROFESSIONAL) {
						StorageManager.set("licenseVerified", user?.licenseVerified)
					}
					const user_data = AuthenticationManager.decodeToken(data.token);
					success_cb(user_data.role);
				} else if (Array.isArray(data.errors)) {
					failure_cb({ status: "validation", data: data.errors, message: "Invalid input" });
				}
				else {
					failure_cb({ status: "wrong", message: "Wrong login details" });
				}
			})
			.catch((err) => {
				catch_cb(err);
				NotificationManager.notifyUser({
					type: 'error',
					message: 'Login Failed. Please check your internet connection and try again later.',
				})
			});
	}

	const signUp = ({ body, success_cb = () => {/*empty to prevent null calls*/ }, failure_cb = () => {/*empty to prevent null calls*/ }, catch_cb = (err) => { } }) => {
		fetch(REGISTER_URL, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			}
		}).then(response => response.json())
			.then((data) => {
				if (data.status === 200) {
					success_cb();
				} else if (Array.isArray(data.errors)) {
					failure_cb({ status: "validation", data: data.errors, message: "Invalid input provided." });
				}
				else {
					failure_cb({ data: { status: "failed", message: "Registration failed." } });
				}
			})
			.catch((err) => {
				failure_cb({ data: err });
			});
	}

	const signOut = (success_cb) => {
		const user = AuthenticationManager.getStoredUser();
		AuthenticationManager.clearUserData();
		success_cb(user);
	}

	return (
		<AuthContext.Provider value={{
			signUp, getToken, getUser, signIn, signOut, openModal, setOpenModal, openModalButton, setOpenModalButton
		}}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContext;