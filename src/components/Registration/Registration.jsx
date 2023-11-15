import { useState } from 'react';
import NotificationManager from '../../utils/NotificationManager';
import { UrlHelper } from '../../utils/UrlHelper';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Typography, Grid, Box, TextField, IconButton, MenuItem, InputAdornment
} from '@mui/material';
import "./Registration.scss";
import { Link } from "react-router-dom";
import AuthenticationManager from '../../utils/AuthenticationManager';
import VerifyEmailBlock from '../VerifyEmailBlock';
import Button from '../Button';

const REGISTRATION_URL = UrlHelper.createApiUrlPath("api/users/register");

export default function Registration() {
	const [showPassword, setShowPassword] = useState(false);
	const [infoText, setInfoText] = useState("");
	const [completed, setCompleted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		role: "", name: "", email: "", password: "", passwordConfirm: "",
		phone: {
			dialCode: "233",
			number: ""
		},
	});
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
	function handlePhoneChange(evt) {
		const value = evt.target.value;
		setFormData({
			...formData,
			phone: {
				...formData.phone,
				[evt.target.name]: value.trim()
			}
		});
	}

	const handleFormSubmission = (event) => {
		event.preventDefault();
		if (formData.password !== formData.passwordConfirm) {
			NotificationManager.notifyUser({
				type: 'info',
				message: 'Passwords do not match',
				duration: 3000
			})
			return false;
		}
		const passCheck = AuthenticationManager.checkPasswordStrength(formData.password);
		if (!passCheck.status) {
			NotificationManager.notifyUser({
				type: 'info',
				message: "Password must be at least eight characters with a number, symbol, upper and lower case letters.",
				duration: 3000
			})
			setInfoText("Password must be at least eight characters with a number, symbol, upper and lower case letters")
			return false;
		}
		setIsLoading(true);
		const data = {
			...formData,
			"preference": {
				"country": localStorage.getItem("countryCode") ?? 'GH',
			}
		}
		fetch(REGISTRATION_URL, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then(data => data.json())
			.then((data) => {
				if (data.status && data.status === 201) {
					NotificationManager.notifyUser({ type: 'success', message: 'Registration was successful. You can login to your account now' })
					setCompleted(true);
				}
				else if (data.status === 409) {
					NotificationManager.notifyUser({ type: 'info', message: 'Email already exists.' })
					setInfoText(data.message ?? "Email already exists.");
					setIsLoading(false);
				}
				else {
					setInfoText(`Registration Failed. ${data.message ?? ""}`);
					NotificationManager.notifyUser({ type: 'error', message: `Registration Failed. ${data.message ?? ""}` })
					setIsLoading(false);
				}

			})
			.catch((err) => {
				console.log(err);
				NotificationManager.notifyUser({ type: 'error', message: 'Registration Failed. Please check your internet connection and try again later.' })
				setInfoText("Network error. Try again later.");
				setIsLoading(false);
			});
		return true;
	};

	return (
		<>{completed ?
			<VerifyEmailBlock />
			:
			<Box>
				<Typography className='formTitle' component="span" variant="subtitle2" mt={3}>Sign Up</Typography>
				<Typography color={"red"} variant="body2" className='infoText'>{infoText}</Typography>
				<Box component={"form"} className='form' method="POST" onSubmit={handleFormSubmission}
					sx={{ display: "flex", justifyContent: "space-between" }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField fullWidth variant="outlined" margin="normal" disabled={isLoading} required
								id="name" placeholder='Ama Mohammed' className='textInput' label="name" value={formData.name}
								onChange={handleChange} name="name" autoComplete="name"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField size='medium' variant="outlined" margin="normal" required fullWidth disabled={isLoading}
								type="email" className='textInput' id="email" placeholder='happy@email.com' label="Email Address"
								name="email" value={formData.email} onChange={handleChange} autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
							<TextField select
								sx={{ minWidth: 90, marginRight: 1 }} disabled={isLoading} required id="dialCode"
								name="dialCode" value={formData.phone.dialCode} onChange={handlePhoneChange} autoComplete="tel-country-code" label="Dial Code"
							>
								<MenuItem selected value="233">+233</MenuItem>
							</TextField>
							<TextField
								disabled={isLoading} variant="outlined" label="Phone Number" sx={{ maxWidth: 200, minWidth: 192, marginRight: 1 }} id="number" type={'tel'}
								value={formData.phone.number} name="number" required autoComplete="tel" onChange={handlePhoneChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField select fullWidth required disabled={isLoading} label="Register as a" id="userType" name="role"
								value={formData.role} onChange={handleChange}>
								<MenuItem value="ind">Individual</MenuItem>
								<MenuItem value="org">Organization</MenuItem>
								<MenuItem value='pro'>Health Professional</MenuItem>
								<MenuItem value="clinic">Health Facility</MenuItem>
							</TextField>
						</Grid>
						<Grid item xs={12} sm={6}>

							<TextField fullWidth id="password" label="Password" type={showPassword ? 'text' : 'password'} value={formData.password}
								name="password" disabled={isLoading} required onChange={handleChange}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end">
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField fullWidth id="confirm" label="Confirm Password" disabled={isLoading} type={showPassword ? 'text' : 'password'}
								value={formData.passwordConfirm} onChange={handleChange} name="passwordConfirm" required
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge="end">
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									)
								}}
							/>
						</Grid>
						<Grid item xs={6}>
							<Button type="submit" fullWidth color="primary" loading={isLoading}>Register</Button>
						</Grid>
						<Grid item xs={6}>
							<Link to="/" variant="body2">
								{"Already have an account? Sign In"}
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		}</>
	);
}