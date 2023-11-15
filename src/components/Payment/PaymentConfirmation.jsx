import { Check } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';
import Button from '../Button';

const PaymentConfirmation = () => {
	const goBack = () => {
		window.top.history.back();
	}

	return (
		<Paper elevation={5} sx={{ p: 5 }}>
			<Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
				<Box mb={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
					<Typography sx={{marginBottom: "1em"}} variant='body1'>Payment confirmed</Typography>
					<Check sx={{ width: "150px", height: "150px", color: "#fff", backgroundColor: "#0b6400", borderRadius: "50%", }} />
				</Box>
				<Box sx={{ display: "flex", mt: 2, justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
					<Typography variant='subtitle2' mb={3}>Thank you!</Typography>
					<Typography variant='caption' mb={2}>Your payment has been confirmed. Click the button below to go back to the application.</Typography>
					<Box sx={{marginTop: "1em"}}>
						<Button onClick={goBack}>Return to application</Button>
					</Box>
				</Box>
			</Box>
		</Paper >
	);
}

export default PaymentConfirmation;
