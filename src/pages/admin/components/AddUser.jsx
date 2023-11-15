import { Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import FetchManager from '../../../utils/FetchManager';
import NotificationManager from '../../../utils/NotificationManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import Button from '../../../components/Button';

const USERS_URL = UrlHelper.createApiUrlPath("/api/users/");
const AddUser = ({role}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [added, setAdded] = useState(false);
	const [textValue, setTextValue] = useState({
		role, 
		name: "", 
		email: "",
		phone: {
			dialCode: "233",
			number: ""
		},
	});

	function handleChange(evt) {
		setTextValue({
			...textValue,
			[evt.target.name]: evt.target.value
		});
	}
	function handlePhoneChange(evt) {
		const value = evt.target.value;
		setTextValue({
			...textValue,
			phone: {
				...textValue.phone,
				[evt.target.name]: value.trim()
			}
		});
	}

	const addUser = () => {
		setIsLoading(true)
		FetchManager.fetch({
			url: USERS_URL,
			body: textValue,
			method: "POST",
			success_cb: (res) => {
				NotificationManager.notifyUser({type: "success", message: "User added successfully", toastId: 1})
				setAdded(true)
				setTimeout(() => {
					window.location.reload();
				}, 1000); 
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ type: "warning", message: "Failed to add user.", toastId: 1 })
			}
		})
	}

	return (
		<Box>
			{ !added && <Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<TextField fullWidth variant="outlined" margin="normal" disabled={isLoading} required
						id="name" placeholder='Ama Mohammed' className='textInput' label="name" value={textValue.name}
						onChange={handleChange} name="name" autoComplete="name" 
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField size='medium' variant="outlined" margin="normal" required fullWidth
						type="email" className='textInput' id="email" placeholder='happy@email.com' label="Email Address"
						name="email" value={textValue.email} onChange={handleChange} autoComplete="email"
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
						<FormControl className='textInput' variant="outlined" >
							<InputLabel htmlFor="outlined-adornment-dialCode">Dial Code</InputLabel>
							<Select
								sx={{ minWidth: 90, marginRight: 6 }} disabled={isLoading} required labelId="dialCodeLabel" id="dialCode"
								name="dialCode" value={textValue.phone.dialCode} onChange={handlePhoneChange} autoComplete="tel-country-code" label="User Type"
							>
								<MenuItem selected value="233">+233</MenuItem>
							</Select>
						</FormControl>
						<FormControl fullWidth className='textInput' variant="outlined">
							<InputLabel htmlFor="outlined-adornment-phone-number">Phone Number</InputLabel>
							<OutlinedInput
								disabled={isLoading} sx={{ maxWidth: 200, minWidth: 192, marginRight: 1 }} id="number" type={'tel'}
								value={textValue.phone.number} name="number" required autoComplete="tel" onChange={handlePhoneChange}
							/>
						</FormControl>
					</Box>

				</Grid>
				<Grid item xs={12} sm={6}>
					<FormControl className='textInput' fullWidth variant="outlined" >
						<InputLabel id="userTypeLabel">User Type</InputLabel>
						<Select required disabled labelId="userTypeLabel" id="userType" name="role"
							value={textValue.role} onChange={handleChange} label="User Type">
							<MenuItem value="ind">Individual</MenuItem>
							<MenuItem value="org">Organization</MenuItem>
							<MenuItem value='pro'>Health Professional</MenuItem>
							<MenuItem value="clinic">Health Facility</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item>
					{!isLoading &&
						<Button type="submit" onClick={addUser}>Add Health Professional</Button>
					}
					{isLoading &&
						<Box className="loaderWrapper"><CircularProgress /></Box>
					}
				</Grid>
			</Grid>}
			{added && <Box>
				<Typography> User Added Successfully</Typography>
				</Box>}
		</Box>
	);
}

export default AddUser;
