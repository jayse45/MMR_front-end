import { useState } from 'react' 
import FetchManager from '../../utils/FetchManager'; 
import { Box, Grid, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'; 
import NotificationManager from '../../utils/NotificationManager'; 
import { UrlHelper } from '../../utils/UrlHelper'; 
import Button from '../Button'; 
import LoadingCircle from '../LoadingCircle'; 
 
const USERS_URL = UrlHelper.createApiUrlPath("/api/users/update"); 
 
export default function BioData({userData}) { 
	const [isLoading, setLoading] = useState(false); 
	const [accountData, setAccountData] = useState({ 
		name: "", 
		email: "", 
		dob: "", 
		gender: "", 
		role: "", 
		phone: { 
			dialCode: "233", 
			number: "" 
		}, 
		...userData, 
	}); 
	const handleChange = (evt) => { 
		setAccountData({ 
			...accountData, 
			[evt.target.name]: evt.target.value 
		}); 
	} 
	const handlePhoneChange = (evt) => { 
		const value = evt.target.value; 
		setAccountData({ 
			...accountData, 
			phone: { 
				...accountData.phone, 
				[evt.target.name]: value.trim() 
			} 
		}); 
	} 
 
	const changeAccountInformation = (evt) => { 
		evt.preventDefault(); 
		setLoading(true) 
		FetchManager.fetch({ 
			url: USERS_URL, 
			body: accountData, 
			method: "PUT", 
			success_cb: () => { 
				NotificationManager.notifyUser({ type: "success", message: "Account information changed successfully", toastId: 1 }) 
				setLoading(false) 
			}, 
			failure_cb: () => { 
				NotificationManager.notifyUser({ type: "warning", message: "Failed to change account information.", toastId: 1 }) 
			} 
		}) 
	} 
 
	 
	return (<Box> 
		{isLoading && 
			<LoadingCircle /> 
		} 
		{ 
			!isLoading && 
			<form onSubmit={changeAccountInformation}> 
				<Grid container rowSpacing={2} spacing={2}> 
					<Grid item xs={12}> 
						<TextField fullWidth variant="outlined" disabled={isLoading} required 
							id="name" placeholder='Ama Mohammed' className='textInput' label="name" value={accountData.name} 
							onChange={handleChange} name="name" autoComplete="name"  
						/> 
					</Grid> 
					<Grid item xs={12}> 
						<TextField size='medium' variant="outlined" required disabled fullWidth 
							type="email" className='textInput' id="email" placeholder='happy@email.com' label="Email Address" 
							name="email" value={accountData.email} onChange={handleChange} autoComplete="email" 
						/> 
					</Grid> 
					<Grid item xs={6}> 
						<TextField size='medium' variant="outlined" required disabled fullWidth 
							type="text" className='textInput' id="role" placeholder='happy@email.com' label="User Role" 
							name="role" value={accountData.role} onChange={handleChange} autoComplete="role" 
						/> 
					</Grid> 
					<Grid item xs={6}> 
						<FormControl fullWidth className='textInput' variant="outlined"> 
							<InputLabel htmlFor="outlined-adornment-phone-number">Date of Birth</InputLabel> 
							<OutlinedInput fullWidth variant="outlined" size="normal" type={"date"} disabled={isLoading} required 
								id="dob" className='textInput' label="dob" value={accountData.dob} 
								onChange={handleChange} name="dob" autoComplete="dob"  
							/> 
						</FormControl> 
					</Grid> 
 
					<Grid item xs={4} sm={2}> 
						<FormControl className='textInput' variant="outlined" > 
							<InputLabel htmlFor="outlined-adornment-dialCode">Dial Code</InputLabel> 
							<Select sx={{minWidth: "100px"}} 
								disabled={isLoading} required labelId="dialCodeLabel" id="dialCode" 
								name="dialCode" value={accountData.phone.dialCode} onChange={handlePhoneChange} autoComplete="tel-country-code" label="dial-code" 
							> 
								<MenuItem selected value="233">+233</MenuItem> 
							</Select> 
						</FormControl> 
					</Grid> 
					<Grid item xs={8} sm={4}> 
						<FormControl fullWidth className='textInput' variant="outlined"> 
							<InputLabel htmlFor="outlined-adornment-phone-number">Phone Number</InputLabel> 
							<OutlinedInput 
								disabled={isLoading} id="number" type={'tel'} 
								value={accountData.phone.number} name="number" required autoComplete="tel" onChange={handlePhoneChange} 
							/> 
						</FormControl> 
					</Grid> 
					<Grid item xs={6}> 
						<FormControl fullWidth className='textInput' variant="outlined" > 
							<InputLabel htmlFor="outlined-adornment-gender">Gender</InputLabel> 
							<Select 
								sx={{ minWidth: 200 }} disabled={isLoading} required labelId="genderLabel" id="gender" 
								name="gender" value={accountData.gender} onChange={handleChange} autoComplete="gender" label="gender"> 
								<MenuItem selected value="">Choose</MenuItem> 
								<MenuItem selected value="M">Male</MenuItem> 
								<MenuItem selected value="F">Female</MenuItem> 
								<MenuItem selected value="O">Other</MenuItem> 
							</Select> 
						</FormControl> 
					</Grid> 
 
					<Grid item xs={12} sm={8} marginTop={3}> 
						<Button type="submit">Update</Button> 
					</Grid> 
				</Grid> 
			</form> 
		} 
 
	</Box> 
	) 
} 
