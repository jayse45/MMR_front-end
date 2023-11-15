import { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import NotificationManager from '../../utils/NotificationManager';
import { CircularProgress, Box, Typography, Checkbox, FormControlLabel, TextField } from '@mui/material';
import AuthContext from '../../context/AuthProvider';
import styles from './Login.module.scss';
import Button from '../Button';

export default function LoginPage({ userType = "" }) {
	const [remember, setRememberState] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [infoText, setInfoText] = useState(false);
	const [textValue, setValueState] = useState({
		email: "",
		password: "",
	})
	const { signIn } = useContext(AuthContext)

	function handleRememberChange() {
		setRememberState(!remember);
	}
	function handleChange(evt) {
		const value = evt.target.value;
		setValueState({
			...textValue,
			[evt.target.name]: value
		});
	}

	const handleLoginSubmission = (event) => {
		event.preventDefault();
		setIsLoading(true);
		setInfoText("");
		if (textValue.email === "" || textValue.password === "") {
			event.preventDefault();
			return false;
		}

		const success_cb = (data) => {
			NotificationManager.notifyUser({
				type: 'success',
				message: 'Login Successful',
			});
			window.location = "/";
		}
		const failure_cb = (response) => {
			setIsLoading(false);
			if (response.status === "wrong") {
				setInfoText(response.message || 'Wrong login details');
			} else if (response.status === "validation") {
				setInfoText(response.data[0].msg);
			}
			NotificationManager.notifyUser({
				type: 'error',
				message: response.message,
			})
		};

		const catch_cb = (err) => {
			console.log(err);
			setIsLoading(false);
			NotificationManager.notifyUser({
				type: 'error',
				message: 'Login Failed. Please check your internet connection and try again later.',
			})
		};

		signIn({
			email: textValue.email,
			password: textValue.password,
			remember,
			userType,
			success_cb,
			failure_cb,
			catch_cb
		})
		return true;
	};
	return (
		<Box>
			<Typography className={styles.formTitle} component="span" variant="subtitle2" mt={3}>
				{userType !== "admin" ? "Login" : "Admin Login"}
			</Typography>
			<Box component={"form"} className='form' method="POST" onSubmit={handleLoginSubmission}>
				<Typography color={"red"} variant="body2" className='infoText'>{infoText}</Typography>
				<TextField variant="outlined" margin="normal" disabled={isLoading} required fullWidth id="email" label="Email Address" name="email"
					type="email" value={textValue.email} onChange={handleChange} autoComplete="email"
				/>
				<TextField disabled={isLoading} variant="outlined" margin="normal" required fullWidth name="password" label="Password"
					type="password" id="password" value={textValue.password} onChange={handleChange} autoComplete="current-password"
				/>
				<FormControlLabel
					disabled={isLoading}
					control={
						<Checkbox
							value="remember"
							color="primary"
							checked={remember}
							onChange={handleRememberChange}
						/>
					}
					label="Remember me"
				/>

				{!isLoading &&
					<Button type="submit" fullWidth disabled={isLoading} variant="contained" color="primary" className='submit'>
						Sign In
					</Button>
				}
				{isLoading &&
					<Box className="loaderWrapper">
						<CircularProgress />
					</Box>
				}
				<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
					<Link to="/password_reset_request" variant="body2">
						Forgot password?
					</Link>
					{userType !== "admin" &&
						<Link to="/registration" variant="body2">
							Don't have an account? Sign Up
						</Link>
					}
					{userType === "admin" &&
						<Link to="/" variant="body2">
							User Login
						</Link>
					}
				</Box>
			</Box>
		</Box>
	);
}