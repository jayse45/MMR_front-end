import { useEffect } from "react";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
	const navigate = useNavigate();
	const { getUser, signOut } = useAuth();
	const location = useLocation();
	const user = getUser();
	const logout = () => {
		signOut((user) => {
			if (user && user.role === "admin") {
				return navigate("/admin");
			} else {
				return navigate("/login");
			}
		})
	}
	useEffect(() => {
		if (!user) {
			return logout();
		}
		if (user?.exp < Date.now() / 1000) { // in milliseconds
			return logout();
		}
		return
	// eslint-disable-next-line
	}, []);
	
	
	return (
		allowedRoles?.includes(user?.role)
			? <Outlet />
			: user
				? <Navigate to="/unauthorized" state={{ from: location }} replace />
				: <Navigate to="/login" state={{ from: location }} replace />
	);
}

export default RequireAuth;