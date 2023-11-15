import logo from '../static/img/logo.png';
import { Box, Container, CssBaseline } from '@mui/material';
import Copyright from '../components/Copyright/Copyright';
import Registration from '../components/Registration/Registration';

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

export default function RegistrationPage() {
	return (
		<>
			<Box className="overlay" />
			<Box className="RegistrationPage">

				<Container component="main" sx={{ backgroundColor: "red" }}>
					<CssBaseline />
					<Box >
						<Box sx={styles.paper}>
							<Box component={"img"} sx={styles.logo} src={logo} alt="Logo" />
							<Registration />
						</Box>
						<Box textAlign="center" marginTop={5}>
							<Copyright />
						</Box>
					</Box>
				</Container>
			</Box>
			
		</>
	);
}