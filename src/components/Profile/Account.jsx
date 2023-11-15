import { Box, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import Picture from './Picture';
import BioData from './BioData';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import NotificationManager from '../../utils/NotificationManager';
import LoadingCircle from '../LoadingCircle';
import StorageManager from '../../utils/StorageManager';

const USERS_URL = UrlHelper.createApiUrlPath("/api/users/info");

const Account = () => {
	const [isLoading, setLoading] = useState(true);
	const [userData, setUserData] = useState({});
	useEffect(() => {
		FetchManager.fetch({
			url: USERS_URL,
			success_cb: (res) => {
				setUserData(res.body)
				setLoading(false);
				StorageManager.set("licenseVerified", res.body?.licensePicture?.status === "approved")
			},
			failure_cb: () => {
				NotificationManager.notifyUser({ type: "warning", message: "Failed to get user information.", toastId: 1 })
				setLoading(false);
			}
		})
	}, []);
	return <Box sx={{ minHeight: "400px" }}>
		{isLoading ? <LoadingCircle /> :
			<Grid container spacing={5} justifyContent="center">
				<Grid item xs={12} sm={3} md={3} xl={3} pr={3}>
					<Picture image={userData.photo} />
				</Grid>
				<Grid item xs={12} sm={7} md={7} xl={6}>
					<BioData userData={userData} />
				</Grid>
			</Grid>
		}
	</Box>
}

export default Account;