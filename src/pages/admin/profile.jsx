import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'; 
import { useState, useEffect } from 'react'; 
import NotificationManager from '../../utils/NotificationManager'; 
import FetchManager from '../../utils/FetchManager'; 
import { UrlHelper } from '../../utils/UrlHelper'; 
import Button from '../../components/Button'; 
import LoadingCircle from '../../components/LoadingCircle'; 
import ConfigurationManager from '../../utils/ConfigurationManager'; 
import NavListItems from './components/NavListItems'; 
import Layout from '../../components/Layout/Layout'; 
const ADMINS_URL = UrlHelper.createApiUrlPath("/api/admins/"); 
 
const ProfilePage = () => { 
	const [isLoading, setLoading] = useState(true); 
	const [accountData, setAccountData] = useState({ 
		name: "", 
		email: "", 
		dob: "", 
		gender: "", 
	}); 
	const handleChange = (evt) => { 
		setAccountData({ 
			...accountData, 
			[evt.target.name]: evt.target.value 
		}); 
	} 
 
	const changeAccountInformation = (evt) => { 
		evt.preventDefault(); 
		setLoading(true) 
		FetchManager.fetch({ 
			url: `${ADMINS_URL}update`, 
			body: accountData, 
			method: "PUT", 
			success_cb: (res) => { 
				NotificationManager.notifyUser({ type: "success", message: "Account information changed successfully", toastId: 1 }) 
				setLoading(false) 
			}, 
			failure_cb: (res) => { 
				NotificationManager.notifyUser({ type: "warning", message: "Failed to change account information.", toastId: 1 }) 
			} 
		}) 
	} 
 
	useEffect(() => { 
		FetchManager.fetch({ 
			url: `${ADMINS_URL}info`, 
			success_cb: (res) => { 
				setAccountData({ 
					name: res.body.name, 
					email: res.body.email, 
					dob: res.body.dob ?? "", 
					role: ConfigurationManager.getConfig("ROLE_KEYS")[res.body.role], 
					gender: res.body.gender ?? "", 
					phone: res.body.phone ?? { 
						dialCode: "+233", 
						number: "" 
					} 
				}) 
				setLoading(false); 
			}, 
			failure_cb: (res) => { 
				NotificationManager.notifyUser({ type: "warning", message: "Failed to get user information.", toastId: 1 }) 
				setLoading(false); 
 
			} 
		}) 
	}, []); 
 
	return <Layout navList={NavListItems}> 
		{isLoading ? <LoadingCircle /> : 
			<Box sx={{ backgroundColor: "white", border: "1px solid #00000050", borderRadius: "0 0 10px 10px", minHeight: "400px" }} p={2}> 
				<form onSubmit={changeAccountInformation}> 
					<Grid container spacing={1} justifyContent="center" alignItems="center"> 
						<Grid item xs={12} sm={8}> 
							<TextField fullWidth variant="outlined" disabled={isLoading} required 
								id="name" placeholder='Ama Mohammed' className='textInput' label="name" value={accountData.name} 
								onChange={handleChange} name="name" autoComplete="name"  
							/> 
						</Grid> 
						<Grid item xs={12} sm={8}> 
							<TextField size='medium' variant="outlined" required disabled fullWidth 
								type="email" className='textInput' id="email" placeholder='happy@email.com' label="Email Address" 
								name="email" value={accountData.email} onChange={handleChange} autoComplete="email" 
							/> 
						</Grid> 
						<Grid item xs={12} sm={8}> 
							<Box sx={{ display: 'flex', alignItems: 'flex-end' }}> 
								<FormControl className='textInput' variant="outlined" > 
									<InputLabel htmlFor="outlined-adornment-gender">Gender</InputLabel> 
									<Select 
										sx={{ minWidth: 200, marginRight: 10 }} disabled={isLoading} required labelId="genderLabel" id="gender" 
										name="gender" value={accountData.gender} onChange={handleChange} autoComplete="gender" label="gender"> 
										<MenuItem selected value="">Choose</MenuItem> 
										<MenuItem selected value="M">Male</MenuItem> 
										<MenuItem selected value="F">Female</MenuItem> 
										<MenuItem selected value="O">Other</MenuItem> 
									</Select> 
								</FormControl> 
							</Box> 
						</Grid> 
						<Grid item xs={12} sm={8} marginTop={3}> 
							<Button type="submit">Update Information</Button> 
						</Grid> 
					</Grid> 
				</form> 
			</Box> 
		} 
 
 
	</Layout> 
} 
 
export default ProfilePage;