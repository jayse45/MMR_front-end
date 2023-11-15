import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import NavListItems from './components/NavListItems';
import Account from '../../components/Profile/Account';
import Security from '../../components/Profile/Security';
import HealthProfessionalExtraUpdate from './components/HealthProfessionalExtraUpdate';
import StorageManager from '../../utils/StorageManager';
import CustomModal from '../../components/Modal/CustomModal';
import useAuth from '../../hooks/useAuth';

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const ProfilePage = () => {
	const [index, setIndex] = useState(0);
	const licenseVerified = JSON.parse(StorageManager.get("licenseVerified"))
	const { setOpenModal } = useAuth();
	const handleChangeIndex = (event, newValue) => {
		setIndex(newValue);
	};

	useEffect(()=>{
		setOpenModal(!licenseVerified)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	return (
		<Layout navList={NavListItems}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={index} onChange={handleChangeIndex} aria-label="basic tabs example">
					<Tab label="Account" {...a11yProps(0)} />
					<Tab label="Security" {...a11yProps(1)} />
					<Tab label="Professional Information" {...a11yProps(2)} />
				</Tabs>
			</Box>
			<Box sx={{ backgroundColor: "white", border: "1px solid #00000050", borderRadius: "0 0 10px 10px" }} p={2}>
				{index === 0 &&
					<Account />
				}
				{index === 1 &&
					<Security />
				}
				{index === 2 &&
					<HealthProfessionalExtraUpdate />
				}
			</Box>
			<CustomModal onClose={() => setOpenModal(false)}>
				<Box>
					<Typography id="modal-title" variant="h6" component="h2">
						License verification required
					</Typography>
					<Typography id="modal-description" sx={{ mt: 2 }}>
						Please allow up to 48 hours for your license to be verified. 
						If your license was rejected, you can upload a new one from this page.
					</Typography>
					<Typography variant="caption">If you believe this is not correct, reload this page.</Typography>
				</Box>
			</CustomModal>
		</Layout>
	);
}

export default ProfilePage;