import { Box, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import NotificationManager from '../../utils/NotificationManager';
import Button from '../Button';
import FetchManager from '../../utils/FetchManager';
import { UrlHelper } from '../../utils/UrlHelper';

const ADMIN_URL = UrlHelper.createApiUrlPath("/api/admins/")

const EditAdmin = ({ admin }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [textValue, setTextValue] = useState({
		name: admin.name, 
		email: admin.email,
		gender: admin.gender ?? ""
	});

	function handleChange(evt) {
		setTextValue({
			...textValue,
			[evt.target.name]: evt.target.value.trim()
		});
	}

	const updateAdmin = () => {
		//NotificationManager.notifyUser({ message: "Feature unavailable", toastId: 1 });
		setIsLoading(true);
		FetchManager.fetch({
			url: ADMIN_URL + admin._id,
			body: { name: textValue.name, gender: textValue.gender },
			method: "PUT",
			success_cb: () => {
				NotificationManager.notifyUser({ type: "success", message: "Admin information changed successfully", toastId: 1 })
				window.location.reload();
			},
			failure_cb: () => {
				NotificationManager.notifyUser({ type: "warning", message: "Failed to change admin information.", toastId: 1 })
			}
		})
	}

	return (
		<Box>
			<Grid container spacing={2} rowSpacing={1} justifyContent="center" alignItems="center">
				<Grid item xs={12} sm={8}>
					<TextField fullWidth variant="outlined" margin="normal" disabled={isLoading} required
						id="name" placeholder='Ama Mohammed' className='textInput' label="name" value={textValue.name}
						onChange={handleChange} name="name" autoComplete="name" 
					/>
				</Grid>
				<Grid item xs={12} sm={8}>
					<TextField size='medium' disabled variant="outlined" margin="normal" required fullWidth
						type="email" className='textInput' id="email" placeholder='happy@email.com' label="Email Address"
						name="email" value={textValue.email} onChange={handleChange} autoComplete="email"
					/>
				</Grid>
				<Grid item xs={12} sm={8}>
					<FormControl className='textInput' variant="outlined" >
						<InputLabel htmlFor="outlined-adornment-gender">Gender</InputLabel>
						<Select
							sx={{ minWidth: 200, marginRight: 10 }} disabled={isLoading} required labelId="genderLabel" id="gender"
							name="gender" value={textValue.gender} onChange={handleChange} autoComplete="gender" label="gender">
							<MenuItem selected value="">Choose</MenuItem>
							<MenuItem selected value="M">Male</MenuItem>
							<MenuItem selected value="F">Female</MenuItem>
							<MenuItem selected value="O">Other</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={8}>
					{!isLoading &&
						<Button type="submit" onClick={updateAdmin}>Update</Button>
					}
					{isLoading &&
						<Box className="loaderWrapper"><CircularProgress /></Box>
					}
				</Grid>
			</Grid>
		</Box>
	);
}

export default EditAdmin;
