import { Box, FormControl, FormControlLabel, Switch, FormHelperText, Typography, CircularProgress } from '@mui/material';
import { useState } from 'react';
import FetchManager from '../../../utils/FetchManager';
import NotificationManager from '../../../utils/NotificationManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import Button from '../../../components/Button';

const APPOINTMENT_URL = UrlHelper.createApiUrlPath("/api/appointments/users/");

const ApproveAppointmentForm = ({row}) => {
	const [createSession, setCreateSession] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const handleCreateSessionChange = (evt) => {
		setCreateSession(evt.target.checked)
	}

	const handleSubmission = () => {
		setIsLoading(true);
		FetchManager.fetch({
			url: `${APPOINTMENT_URL}${row._id}/approve?create_session=${createSession}`,
			method: "PUT",
			success_cb: (res) => {
				if (res.status === 200) {
					NotificationManager.notifyUser({ type: "success", message: "Appointment approved successfully." })
					window.location.reload();
				} else {
					setIsLoading(false);
					NotificationManager.notifyUser({ type: "warning", message: "Failed to approve appointment." })
				}
			},
			failure_cb: (res) => {
				setIsLoading(false);
				NotificationManager.notifyUser({ type: "error", message: "Failed to approve appointment." })
			}
		})

	}
	
	return (
		<Box component={"section"} sx={{ minHeight: "150px", minWidth: "500px" }}>
			{isLoading &&
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<CircularProgress />
				</Box>
			}
			{!isLoading && <Box component={"form"}>
				<Typography variant='h5' >Request Appointment</Typography>
				<Box sx={{ marginTop: 2, marginBottom: 2 }}>
					<FormControl fullWidth>
						<FormControlLabel control={<Switch checked={createSession} onChange={handleCreateSessionChange} inputProps={{ 'aria-label': 'controlled' }} />} label="Create Session" />
						<FormHelperText id="session-helper-text">Create a session for this appointment.</FormHelperText>
					</FormControl>
				</Box>
				<Box>
					<Button type="submit" onClick={handleSubmission}>Approve</Button>
				</Box>
			</Box>
			}

		</Box>
	);
}

export default ApproveAppointmentForm;
