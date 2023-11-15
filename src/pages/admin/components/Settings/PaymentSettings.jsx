import { Save, Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Card, FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import Button from '../../../../components/Button';
import LoadingCircle from '../../../../components/LoadingCircle';
import FetchManager from '../../../../utils/FetchManager';
import NotificationManager from '../../../../utils/NotificationManager';
import { UrlHelper } from '../../../../utils/UrlHelper';

const SETTINGS_URL = UrlHelper.createApiUrlPath("/api/settings/");

const PaymentSettings = () => {
	const [settingsData, setSettingsData] = useState({
		payment: {
			paystack: {
				PAYSTACK_SECRET: "",
				PAYSTACK_PUBLIC_KEY: ""
			}
		}
	})
	const [loading, setLoading] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const handleFormChange = (evt) => {
		setSettingsData({
			...settingsData,
			payment: {
				paystack: {
					...settingsData.payment.paystack,
					[evt.target.name]: evt.target.value
				}
			}
		})
	}
	const handleSubmission = (evt) => {
		evt.preventDefault();
		setLoading(true);
		FetchManager.fetch({
			url: SETTINGS_URL,
			method: "PUT",
			body: settingsData,
			success_cb: (res) => {
				if (res.status === 200) {
					NotificationManager.notifyUser({ message: "Payments settings saved.", type: "success" })
				}
				setLoading(false);
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ message: "Error occured while saving payment settings.", type: "warning" })
				setLoading(false);
			}
		})
	}

	useEffect(() => {
		FetchManager.fetch({
			url: SETTINGS_URL,
			success_cb: (res) => {
				if (res.status === 200) {
					setSettingsData(res.body);
				}
				setLoading(false);
			}
		})
	}, []);
	return (
		<Box sx={{ display: "flex", paddingY: "2em", justifyContent: "center", alignItems: "center"}}>
			{loading && <LoadingCircle />}
			{!loading && <Card component={"form"} sx={{ padding: "1em", paddingBottom: "2em", display: "flex", maxWidth: "600px" }}>
				<Grid container spacing={1} rowSpacing={2} justifyContent="center" alignItems="center">
					<Grid item xs={12} sm={8} mt={2}>
						<Typography variant='h5'>PAYSTACK API KEYS</Typography>
					</Grid>
					<Grid item xs={12} sm={8}>
						<FormControl fullWidth>
							<TextField label="PAYSTACK PUBLIC KEY" autoComplete='off'  required id="PAYSTACK_PUBLIC_KEY" name="PAYSTACK_PUBLIC_KEY" placeholder="Public Key.." onChange={handleFormChange} value={settingsData.payment.paystack.PAYSTACK_PUBLIC_KEY} />
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={8}>
						<FormControl fullWidth className='textInput' variant="outlined">
							<InputLabel htmlFor="outlined-adornment-password">PAYSTACK SECRET</InputLabel>
							<OutlinedInput id="PAYSTACK_SECRET" type={showPassword ? 'text' : 'password'}
								name="PAYSTACK_SECRET"  placeholder="Secret Key.." required onChange={handleFormChange} autoComplete='off'
								value={settingsData.payment.paystack.PAYSTACK_SECRET}
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
						<Button type="submit" onClick={handleSubmission}><Save /> Save </Button>
					</Grid>
				</Grid>
			</Card>}
		</Box>
	);
}

export default PaymentSettings;
