import { Save, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Card, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import Button from '../../../../components/Button';
import LoadingCircle from '../../../../components/LoadingCircle';
import FetchManager from '../../../../utils/FetchManager';
import NotificationManager from '../../../../utils/NotificationManager';
import { UrlHelper } from '../../../../utils/UrlHelper';

const SETTINGS_URL = UrlHelper.createApiUrlPath("/api/settings/");
const EmailSettings = () => {
	const [emailSettings, setEmailSettings] = useState({
		email: {
			API_KEY: "",
			API_URL: "",
			SMTP_HOST: "",
			SMTP_PORT: "",
			SMTP_USER: "",
			SMTP_PASS: "",
		}
	})
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const [loading, setLoading] = useState(true);

	const handleFormChange = (evt) => {
		setEmailSettings({
			email: {
				...emailSettings.email,
				[evt.target.name]: evt.target.value.trim()
			}
		})
	}
	const handleSubmission = (evt) => {
		evt.preventDefault();
		setLoading(true);
		let status = false;
		Object.keys(emailSettings.email).forEach(item => {
			if (emailSettings.email[item] === "") {
				NotificationManager.notifyUser({
					type: "info",
					message: `${item} is required.`,
					timer: 1000,
				})
				status = true;
			}
		})
		if (status) {
			setLoading(false);
			return false;
		}
		FetchManager.fetch({
			url: SETTINGS_URL,
			method: "PUT",
			body: emailSettings,
			success_cb: (res) => {
				if (res.status === 200) {
					NotificationManager.notifyUser({ message: "Email settings saved.", type: "success" })
				}
				setLoading(false);
				return true;
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ message: "Error occured while saving email settings.", type: "warning" })
				setLoading(false);
				return false;

			}
		})
		return true;
	}

	useEffect(() => {
		FetchManager.fetch({
			url: SETTINGS_URL,
			success_cb: (res) => {
				if (res.status === 200) {
					setEmailSettings({ email: res.body.email });
				}
				setLoading(false);
			}
		})
	}, []);
	return (
		<Box  sx={{ display: "flex", paddingY: "2em", justifyContent: "center", alignItems: "center" }}>
			{loading && <LoadingCircle />}
			{!loading && <Card component={"form"} sx={{ padding: "1em", paddingBottom: "2em", display: "flex", maxWidth: "600px" }}>
				<Grid container spacing={1} rowSpacing={2} justifyContent="center" alignItems="center">
					<Grid item xs={12} sm={8}>
						<Typography variant='h5' mb={3}>Email Configuration</Typography>
						<TextField fullWidth variant="outlined" required
							id="SMTP_HOST" placeholder='IP Address or host url' className='textInput' label="SMTP HOST/SERVER" value={emailSettings.email.SMTP_HOST}
							onChange={handleFormChange} name="SMTP_HOST" autoComplete="off"
						/>
					</Grid>
					<Grid item xs={12} sm={8}>
						<TextField size='medium' variant="outlined" required fullWidth
							type="text" id="SMTP_USER" placeholder='username or email eg.happy@email.com' label="SMTP USER"
							name="SMTP_USER" value={emailSettings.email.SMTP_USER} onChange={handleFormChange} autoComplete="off"
						/>
					</Grid>
					<Grid item xs={12} sm={8}>
						<TextField fullWidth id="SMTP_PASS" type={showPassword ? 'text' : 'password'} value={emailSettings.email.SMTP_PASS}
							name="SMTP_PASS" required onChange={handleFormChange} autoComplete='off'
							placeholder='username or email eg.happy@email.com'
							label="SMTP PASSWORD"
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
					<Grid item xs={12} sm={8}>
						<TextField size='medium' variant="outlined" required fullWidth
							type="text" className='textInput' id="SMTP_PORT" placeholder='587' label="SMTP PORT" autoComplete="off"
							name="SMTP_PORT" value={emailSettings.email.SMTP_PORT} onChange={handleFormChange}
						/>
					</Grid>
					<Grid item xs={12} sm={8}>
						<TextField fullWidth id="API_KEY" type={showPassword ? 'text' : 'password'} value={emailSettings.email.API_KEY}
							name="API_KEY" required onChange={handleFormChange} autoComplete='off'
							placeholder='API key/secret'
							label="API KEY"
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
					<Grid item xs={12} sm={8}>
						<TextField size='medium' variant="outlined" required fullWidth
							type="text" id="API_URL" placeholder='API endpoint' label="API URL" autoComplete="off"
							name="API_URL" value={emailSettings.email.API_URL} onChange={handleFormChange}
						/>
					</Grid>
					<Grid item xs={12} sm={8}>
						<Button disabled={loading} type="submit" onClick={handleSubmission}><Save /> Save </Button>
					</Grid>
				</Grid>
			</Card>}
		</Box>
	);
}

export default EmailSettings; 
