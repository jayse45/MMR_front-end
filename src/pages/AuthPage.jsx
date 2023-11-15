import { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import logo from '../static/img/logo.png';
import { LinearProgress } from '@mui/material';
import Copyright from '../components/Copyright/Copyright';
import Login from "../components/Login/Login";
import Registration from '../components/Registration/Registration';
import ForgotPassword from '../components/ForgotPasswordForm/ForgotPassword';
import ResetPassword from '../components/ResetPassword/ResetPassword';
import AuthenticationManager from '../utils/AuthenticationManager';
import { useNavigate } from 'react-router-dom';
import ResetPasswordRequest from '../components/ResetPassword/ResetPasswordRequest';
const styles = {
	formContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		height: "100%"
	},
	paper: {
		marginTop: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: 1,
		backgroundColor: 'secondary.main',
	},
	infoText: {
		display: "flex",
		justifyContent: "center",
		lineHeight: "2em",
		color: 'error.main'
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: 1,
	},
	submit: {
		margin: (1, 0, 1),
	},
	logo: {
		width: '80px'
	}
};

export default function AuthPage({ page = "" }) {
	const navigate = useNavigate();
	useEffect(() => {
		if(!AuthenticationManager.isTokenExpired()){
			navigate("/");
		}
	}, [navigate])
	return (
		<div className="AuthPage">
			{true && <LinearProgress />}
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box sx={styles.formContainer}>
					<Box sx={styles.paper}>
						<Box component={"img"} sx={styles.logo} src={logo} alt="Logo" />
						{page === "" && <Login />}
						{page === "admin" && <Login userType='admin'/>}
						{page === "registration" && <Registration />}
						{page === "forgot_password" && <ForgotPassword />}
						{page === "password_reset_request" && <ResetPasswordRequest />}
						{page === "password_reset" && <ResetPassword />}
					</Box>
					<Box textAlign="center">
						<Copyright />
					</Box>
				</Box>
			</Container>
			<div className="overlay" />


		</div>
	);
}