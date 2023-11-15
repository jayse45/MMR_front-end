import { Box, Typography, CircularProgress } from '@mui/material';
import { useState } from 'react';
import FetchManager from '../../../utils/FetchManager';
import NotificationManager from '../../../utils/NotificationManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import Button from '../../../components/Button';

const APPOINTMENT_URL = UrlHelper.createApiUrlPath("/api/appointments/");

const DeclineAppointmentForm = ({ row, onClose }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmission = () => {
		setIsLoading(true);
		FetchManager.fetch({
			url: `${APPOINTMENT_URL}${row._id}/decline`,
			method: "PUT",
			success_cb: (res) => {
				if (res.status) {
					NotificationManager.notifyUser({ type: "success", message: "Appointment declined." })
					window.location.reload();
				} else {
					setIsLoading(false);
					NotificationManager.notifyUser({ type: "warning", message: "Failed to decline appointment." })
				}
			},
			failure_cb: (res) => {
				setIsLoading(false);
				NotificationManager.notifyUser({ type: "error", message: "Failed to decline appointment." })
			}
		})

	}

	return (
		<Box component={"section"} sx={{ minHeight: "100px", minWidth: "500px" }}>
			{isLoading &&
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<CircularProgress />
				</Box>
			}
			{!isLoading && <Box component={"form"}>
				<Box sx={{ marginTop: 2, marginBottom: 3 }}>
					<Typography variant="h6">Are you sure want to cancel appointment? </Typography>
				</Box>
				<Box sx={{ display: "flex", justifyContent: "space-around", paddingRight: 4 }} >
					<Button variant={"outlined"} onClick={() => onClose()}>No</Button>
					<Button onClick={handleSubmission}>Yes</Button>
				</Box>
			</Box>
			}

		</Box>
	);
}

export default DeclineAppointmentForm;
