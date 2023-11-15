import { Box, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import NotificationManager from '../../utils/NotificationManager';
import FetchManager from '../../utils/FetchManager';
import { UrlHelper } from '../../utils/UrlHelper';
import Button from '../Button';
import LoadingCircle from '../LoadingCircle';
import AuthenticationManager from '../../utils/AuthenticationManager';

const USERS_URL = UrlHelper.createApiUrlPath("/api/users/changePassword");

const Security = () => {
	const [isLoading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		password: "",
		new_password: "",
		confirm_password: "",
	});
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const handleChange = (evt) => {
		setFormData({
			...formData,
			[evt.target.name]: evt.target.value
		});
	}

	const changePassword = (evt) => {
		evt.preventDefault();
		if (formData.confirm_password !== formData.new_password) {
			NotificationManager.notifyUser({
				type: 'info',
				message: 'Passwords do not match',
				duration: 3000
			})
			return false;
		}
		const passCheck = AuthenticationManager.checkPasswordStrength(formData.new_password);
		if (!passCheck.status) {
			NotificationManager.notifyUser({
				type: 'info',
				message: passCheck.message,
				duration: 3000
			})
			return false;
		}
		setLoading(true)
		FetchManager.fetch({
			url: USERS_URL,
			body: { password: formData.password, new_password: formData.new_password },
			method: "PUT",
			success_cb: (res) => {
				NotificationManager.notifyUser({ type: "success", message: "Password changed successfully", toastId: 1 })
				setLoading(false)
				setFormData({
					password: "",
					new_password: "",
					confirm_password: ""
				})
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ type: "warning", message: "Failed to change password.", toastId: 1 })
			}
		})
		return true;
	}

	return <Box sx={{ minHeight: "400px" }} component="form">
		{isLoading &&
			<LoadingCircle />
		}
		{
			!isLoading &&
			<Grid sx={{ minHeight: "200px" }} container spacing={1} justifyContent="center" alignItems="center">
				<Grid item xs={12} sm={8}>
					<FormControl fullWidth className='textInput' variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">Current Password</InputLabel>
						<OutlinedInput id="password" type={showPassword ? 'text' : 'password'} value={formData.password}
							name="password" disabled={isLoading} required onChange={handleChange}
							autoComplete='current-password'
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
				</Grid>
				<Grid item xs={12} sm={8}>
					<FormControl fullWidth className='textInput' variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
						<OutlinedInput id="new_password" type={showPassword ? 'text' : 'password'} value={formData.new_password}
							name="new_password" disabled={isLoading} required onChange={handleChange}
							autoComplete='new-password'
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
				</Grid>
				<Grid item xs={12} sm={8}>
					<FormControl fullWidth className='textInput' variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
						<OutlinedInput id="confirm" disabled={isLoading} type={showPassword ? 'text' : 'password'}
							value={formData.confirm_password} onChange={handleChange} name="confirm_password" required
							autoComplete='new-password'
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
				</Grid>
				<Grid item xs={12} sm={8} marginTop={3}>
					<Button type="submit" onClick={changePassword}>Change Password</Button>
				</Grid>
			</Grid>
		}

	</Box>
}

export default Security;