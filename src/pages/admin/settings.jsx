import { Box, Tab, Tabs } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import NavListItems from './components/NavListItems';
import { useState } from 'react';
import PaymentSettings from './components/Settings/PaymentSettings';
import HealthProfessionalTypes from './components/Settings/healthProfessionalTypes/HealthProfessionalTypes';
import EmailSettings from './components/Settings/EmailSettings';
import BodyParts from '../../components/BodyParts.js/BodyParts';

function a11yProps(index) {
	return {
		id: `settings-tab-${index}`,
		'aria-controls': `settings-tabpanel-${index}`,
	};
}
const SettingsPage = () => {
	const [index, setIndex] = useState(0);

	const handleChangeIndex = (event, newValue) => {
		setIndex(newValue);
	};
	return (
		<Layout navList={NavListItems}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={index} onChange={handleChangeIndex} aria-label="basic tabs example">
					<Tab label="Payment API" {...a11yProps(0)} />
					<Tab label="Email" {...a11yProps(1)} />
					<Tab label="Health Professional Types" {...a11yProps(2)} />
					<Tab label="Body Parts" {...a11yProps(3)} />
					
				</Tabs>
			</Box>
			<Box sx={{ backgroundColor: "white", }}>
				{index === 0 &&
					<PaymentSettings />
				}
				{index === 1 &&
					<Box>
						<EmailSettings />
					</Box>
				}
				{index === 2 &&
					<Box>
						<HealthProfessionalTypes />
					</Box>
				}
				{index === 3 &&
					<Box>
						<BodyParts />
					</Box>
				}
				
	
			</Box>
		</Layout>
	);
}

export default SettingsPage;
