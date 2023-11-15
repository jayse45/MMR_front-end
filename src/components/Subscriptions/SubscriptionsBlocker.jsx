import SubscriptionManager from '../../utils/SubscriptionManager';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
import CustomModal from '../Modal/CustomModal';
import useAuth from '../../hooks/useAuth';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

const SubscriptionsBlocker = () => {
	const { setOpenModal } = useAuth();
	const navigate = useNavigate();
	const latestSubscription = SubscriptionManager.getLatestSubscription();
	let endDate = "N/A";
	let new_user = false;
	if (latestSubscription?.endTimestamp) {
		endDate = new Date(latestSubscription.endTimestamp).toLocaleDateString();
	} else {
		new_user = true
	}
	const handleModalClose = () => {
		setOpenModal(false);
		setTimeout(() => {
			setOpenModal(true);
		}, 500);

	}

	return (
		<CustomModal onClose={handleModalClose} startModalOpen>
			<Box sx={{ px: 5, py: 3 }}>
				{new_user ?
					<>
						<Typography variant='h5' mb={2}>Welcome to MonitorMyRehab</Typography>
						<Typography variant='body1' mb={1}>This is a new telerehab solution for rehab on the Go!</Typography>
						<Typography variant='body2'>You need a subscription to continue. Click the button below to create a new subscription.</Typography>
					</> :
					<>
						<Typography variant='h5'>Subscription Expired</Typography>
						<Typography variant='body1'>Your subscription expired on</Typography>
						<Typography variant='subtitle2'>{endDate}</Typography>
					</>
				}
				<Box sx={{ mt: 4, display: "flex", justifyContent: "space-around" }}>
					<Button onClick={() => navigate("/pay_subscription")}>Pay Subscription</Button>
					<Button href="/logout">Logout</Button>
				</Box>
			</Box>

		</CustomModal>
	);
}

export default SubscriptionsBlocker;
