import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import NotificationManager from '../../utils/NotificationManager';
import Button from '../Button';
import FetchManager from '../../utils/FetchManager';
import { UrlHelper } from '../../utils/UrlHelper';
import { ExpandMore, Visibility, VisibilityOff } from '@mui/icons-material';
import AuthenticationManager from '../../utils/AuthenticationManager';

const ADMIN_URL = UrlHelper.createApiUrlPath("/api/admins/")

const AddAdmin = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "", email: "", gender: "",password: ""
	});

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	function handleChange(evt) {
		setFormData({
			...formData,
			[evt.target.name]: evt.target.value.trim()
		});
	}

	const addAdmin = (evt) => {
		evt.preventDefault();
		const passCheck = AuthenticationManager.checkPasswordStrength(formData.password);
		if (!passCheck.status) {
			NotificationManager.notifyUser({
				type: 'info',
				message: passCheck.message,
				duration: 3000
			})
			return false;
		}
		setIsLoading(true);
		FetchManager.fetch({
			url: ADMIN_URL,
			body: formData,
			method: "POST",
			success_cb: () => {
				NotificationManager.notifyUser({ type: "success", message: "Admin information changed successfully", toastId: 1 })
				window.location.reload();
			},
			failure_cb: () => {
				NotificationManager.notifyUser({ type: "warning", message: "Failed to change admin information.", toastId: 1 })
			}
		})
		return true;
	}

	return (
		<Box component={"form"} onSubmit={addAdmin}>
			<Grid container spacing={2} rowSpacing={1} justifyContent="center" alignItems="center">
				<Grid item xs={12} sm={8}>
					<Typography align='center' variant='h6'>Add Admin</Typography>
					<TextField fullWidth variant="outlined" disabled={isLoading} required
						id="name" placeholder='Ama Mohammed' label="name" value={formData.name}
						onChange={handleChange} name="name" autoComplete="name" 
					/>
				</Grid>
				<Grid item xs={12} sm={8}>
					<TextField size='medium' disabled={isLoading} variant="outlined" required fullWidth
						type="email" id="email" placeholder='happy@email.com' label="Email Address"
						name="email" value={formData.email} onChange={handleChange} autoComplete="email"
					/>
				</Grid>
				<Grid item xs={12} sm={8}>
					<FormControl variant="outlined" fullWidth >
						<InputLabel htmlFor="outlined-adornment-gender">Gender</InputLabel>
						<Select fullWidth disabled={isLoading} required labelId="genderLabel" id="gender"
							name="gender" value={formData.gender} onChange={handleChange} autoComplete="gender" label="gender">
							<MenuItem selected value="">Choose</MenuItem>
							<MenuItem selected value="M">Male</MenuItem>
							<MenuItem selected value="F">Female</MenuItem>
							<MenuItem selected value="O">Other</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={8}>
					<FormControl fullWidth variant="outlined">
						<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
						<OutlinedInput id="password" type={showPassword ? 'text' : 'password'} value={formData.password}
							name="password" disabled={isLoading} required onChange={handleChange}
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
					<Accordion sx={{width: "300px"}}>
						<AccordionSummary
							sx={{backgroundColor: "#eee"}}
							expandIcon={<ExpandMore />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography variant='body2'>Password Requirements</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Box component="ul">
								<li><Typography sx={{ fontSize: "0.6em" }} variant='caption'>Password must be 8 character in length.</Typography></li>
								<li><Typography sx={{ fontSize: "0.6em" }} variant='caption'>Password must have an uppercase letter</Typography></li>
								<li><Typography sx={{ fontSize: "0.6em" }} variant='caption'>Password must have an lowercase letter</Typography></li>
								<li><Typography sx={{ fontSize: "0.6em" }} variant='caption'>Password must have a character</Typography></li>
							</Box>
						</AccordionDetails>
					</Accordion>
					
				</Grid>
				<Grid item xs={12} sm={8}>
					{isLoading ?
						<Box className="loaderWrapper"><CircularProgress /></Box>:
						<Button type="submit">Add</Button>
					}
				</Grid>
			</Grid>
		</Box>
	);
}

export default AddAdmin;
