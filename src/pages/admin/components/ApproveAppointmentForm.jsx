import { Box, FormControl, FormControlLabel, Switch, FormHelperText, TextField, MenuItem, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import FetchManager from '../../../utils/FetchManager';
import NotificationManager from '../../../utils/NotificationManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import Button from '../../../components/Button';

const HEALTH_PROFESSIONAL_URL = UrlHelper.createApiUrlPath("/api/users?role=pro");
const APPOINTMENT_URL = UrlHelper.createApiUrlPath("/api/appointments/");

const ApproveAppointmentForm = ({row}) => {
	const [healthprofessionals, setHealthprofessionals] = useState([]);
	const [healthProfessional, setHealthProfessional] = useState("");
	const [createSession, setCreateSession] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	const handleFormChange = (evt) => {
		setHealthProfessional(evt.target.value)
	}
	const handleCreateSessionChange = (evt) => {
		setCreateSession(evt.target.checked)
	}

	const handleSubmission = () => {
		setIsLoading(true);
		FetchManager.fetch({
			url: `${APPOINTMENT_URL}${row._id}/approve?create_session=${createSession}`,
			method: "PUT",
			body: { healthProfessional_id: healthProfessional },
			success_cb: (res) => {
				if (res.status) {
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

	useEffect(() => {
		FetchManager.fetch({
			url: HEALTH_PROFESSIONAL_URL,
			success_cb: (res) => {
				setHealthprofessionals(res.body);
				setIsLoading(false);
			}
		})

	}, []);
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
					<FormControl fullWidth sx={{marginBottom: 2 }}>
						<TextField required id="healthProfessional" name="healthProfessional" label="Health Professional" onChange={handleFormChange} value={healthProfessional} select>
							{healthprofessionals.map(item => (<MenuItem key={item._id} value={item._id}>{item.name.toLocaleUpperCase()}</MenuItem>))}
						</TextField>
						<FormHelperText id="HealthProfessional-helper-text">Choose the Health Professional for the session.</FormHelperText>
					</FormControl>
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
