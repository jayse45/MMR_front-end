import { React, useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import NotificationManager from '../../utils/NotificationManager';
import {
	OutlinedInput, InputLabel,
	FormControl,
	Box, Typography, InputAdornment, IconButton, Grid, Alert
} from '@mui/material';

import FetchManager from '../../utils/FetchManager';
import { UrlHelper } from '../../utils/UrlHelper';
import Button from '../Button';
import LoadingCircle from '../LoadingCircle';
const PASSWORD_RESET_URL = UrlHelper.createApiUrlPath("api/users/resetPassword");
const VERIFY_PASSWORD_RESET_TOKEN = UrlHelper.createApiUrlPath("api/users/verifyPasswordResetToken");

export default function ResetPassword(userType = "") {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(true);
	const [isTokenVerified, setIsTokenVerified] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const { token } = useParams();

	const [formData, setFormData] = useState(
		{
			password: "",
			confirmPassword: "",
		}
	);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	function handleChange(evt) {
		setFormData({
			...formData,
			[evt.target.name]: evt.target.value
		});
	}

	const handleFormSubmission = (evt) => {
		evt.preventDefault();

		FetchManager.fetch({
			url: PASSWORD_RESET_URL,
			method: "PUT",
			body: {
				...formData,
				token,
			},
			prefetch_cb: () => {
				setLoading(true)
				setErrorMessage("")
			},
			success_cb: (res) => {
				if (res.success) {
					NotificationManager.notifyUser({
						message: "Password reset successful",
						type: "success"
					})
					setTimeout(() => {
						window.location = userType === "admin" ? "/admin" : "/";
					}, 1000);
				} else {
					setLoading(false);
					setErrorMessage(res?.errors[0]?.msg ?? res.message)
					NotificationManager.notifyUser({
						message: res?.errors[0]?.msg ?? res.message,
						type: "info"
					})
				}
			},
			failure_cb: (res) => {
				setLoading(false);
			}
		})
	};

	useEffect(() => {
		FetchManager.fetch({
			url: VERIFY_PASSWORD_RESET_TOKEN,
			method: "PUT",
			body: { token },
			success_cb: (res) => {
				if (res.success) {
					setIsTokenVerified(true);
					setLoading(false)
				} else {
					NotificationManager.notifyUser({
						type: 'error',
						message: res.message,
					})
				}
				setLoading(false);
			},
			failure_cb: (res) => {
				setLoading(false);
			}

		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (

		<Box component="form" onSubmit={handleFormSubmission} mt={5} sx={{width: "100%"}}>
			{loading ? <LoadingCircle />
				: <>
					<Typography variant="subtitle1" align='center' mb={2}>Reset Password</Typography>
					<Typography variant="subtitle2" align='center' color={"red"} mb={1} >{errorMessage}</Typography>
					{isTokenVerified ?
						<Box sx={{ minHeight: "120px" }}>
							<Box>
								<FormControl fullWidth className='textInput' variant="outlined">
									<InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
									<OutlinedInput id="password" autocomplete="new-password" type={showPassword ? 'text' : 'password'} value={formData.password}
										name="password" disabled={loading} required onChange={handleChange}
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end">
													{showPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										}
									/>
								</FormControl>
							</Box>
							<Box marginTop={1}>
								<FormControl fullWidth className='textInput' variant="outlined">
									<InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
									<OutlinedInput id="confirm" autocomplete="new-password" disabled={loading} type={showPassword ? 'text' : 'password'}
										value={formData.confirmPassword} onChange={handleChange} name="confirmPassword" required
										endAdornment={
											<InputAdornment position="end">
												<IconButton
													aria-label="toggle password visibility"
													onClick={handleClickShowPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end"
												>
													{showPassword ? <Visibility /> : <VisibilityOff />}
												</IconButton>
											</InputAdornment>
										}
									/>
								</FormControl>
							</Box>
							<Box mx={1} marginTop={3}>
								<Button loading={loading} disabled={!isTokenVerified} type="submit">Reset Password</Button>
							</Box>

						</Box>
						:
						<Alert severity="error">Invalid token provided.</Alert>
					}
					<Grid container spacing={3} columnSpacing={10} mt={1}>
						{userType !== "admin" &&
							<>
								<Grid item>
									<Link to="/registration" variant="body2">
										Don't have an account? Sign Up
									</Link>
								</Grid>	
								<Grid item xs>
									<Link to="/login" variant="body2">
										Login
									</Link>
								</Grid>
							</>
						}
						{userType === "admin" &&
							<Grid item>
								<Link to="/" variant="body2">
									User Login
								</Link>
							</Grid>
						}
					</Grid>
				</>
			}
		</Box>
	);
}