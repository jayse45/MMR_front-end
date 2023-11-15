import { Box } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import NavListItems from './components/NavListItems';
import UserSubscriptions from '../../components/Subscriptions/UserSubscriptions';

const SubscriptionPage = () => {
	return (
		<Layout navList={NavListItems}>
			<Box component={"main"} >
				<UserSubscriptions />
			</Box>
		</Layout>
	);
}

export default SubscriptionPage;
