import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signout = () => {
	const navigate = useNavigate();
	const { signOut } = useAuth();
	useEffect(() => {
		signOut((user) => {
			if (user && user.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/login");
			}
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<></>
	);
}

export default Signout;
