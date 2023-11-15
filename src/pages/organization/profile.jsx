import { Box, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import NavListItems from './components/NavListItems';
import Account from '../../components/Profile/Account';
import Security from '../../components/Profile/Security';

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const ProfilePage = () => {
	const [index, setIndex] = useState(0);

	const handleChangeIndex = (event, newValue) => {
		setIndex(newValue);
	};

	return (
		<Layout navList={NavListItems} restricted={false} page={"Profile"}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={index} onChange={handleChangeIndex} aria-label="basic tabs example">
					<Tab label="Account" {...a11yProps(0)} />
					<Tab label="Security" {...a11yProps(1)} />
				</Tabs>
			</Box>
			<Box sx={{ border:"1px solid #00000050", borderRadius: "0 0 10px 10px", backgroundColor: "#fff"}} p={2}>
				{index === 0 &&
					<Account />
				}
				{index === 1 &&
					<Security />
				}

			</Box>
		</Layout>
	);
}

export default ProfilePage;