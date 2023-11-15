import { Box, FormControl, FormHelperText, TextField, MenuItem, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import FetchManager from '../../utils/FetchManager';
import NotificationManager from '../../utils/NotificationManager';
import { UrlHelper } from '../../utils/UrlHelper';
import Button from '../../components/Button';

const HEALTH_PROFESSIONAL_TYPE_URL = UrlHelper.createApiUrlPath("/api/healthprofessionalTypes");
const HEALTH_PROFESSIONAL_URL = UrlHelper.createApiUrlPath("/api/users?role=pro");
const SESSION_URL = UrlHelper.createApiUrlPath("/api/sessions/");

const EditSessionForm = ({ session }) => {
	const now = new Date(session.timestamp);
	const dateString = `${now.getFullYear()}-${now.getMonth().toLocaleString('en', { minimumIntegerDigits: 2 })}-${now.getDate().toLocaleString('en', { minimumIntegerDigits: 2 })}`;
	const timeString = `${now.getHours().toLocaleString('en', { minimumIntegerDigits: 2 })}:${now.getMinutes().toLocaleString('en', { minimumIntegerDigits: 2 })}`;

	const [healthprofessionals, setHealthprofessionals] = useState([]);
	const [healthprofessionaltypes, setHealthprofessionaltypes] = useState([]);
	const [formData, setFormData] = useState({
		healthProfessionalType: session.healthProfessionalType_id,
		healthProfessional: session.healthProfessional_id,
		type: session.type,
		patient: session.patient,
		date: dateString,
		time: timeString

	});
	const types = ["online", "offline"];
	const [isLoading, setIsLoading] = useState(true);

	const handleFormChange = (evt) => {
		const name = evt.target.name;
		setFormData({
			...formData,
			[name]: evt.target.value
		})
	}

	const handleSubmission = () => {
		setIsLoading(true);
		const timestamp = new Date();
		let temp = formData.date.split("-");
		timestamp.setFullYear(temp[0])
		timestamp.setMonth(temp[1])
		timestamp.setDate(temp[2])

		temp = formData.time.split(":");

		timestamp.setHours(temp[0])
		timestamp.setMinutes(temp[1])
		console.log(timestamp)
		const data = {
			...formData,
			timestamp: timestamp.getTime()
		}

		FetchManager.fetch({
			url: SESSION_URL,
			body: data,
			method: "PUT",
			success_cb: (res) => {
				if (res.status) {
					NotificationManager.notifyUser({ type: "success", message: "Session updated successfully." })
					window.location.reload();
				} else {
					setIsLoading(false);
					NotificationManager.notifyUser({ type: "warning", message: "Failed to update session." })
				}
			},
			failure_cb: (res) => {
				setIsLoading(false);
				NotificationManager.notifyUser({ type: "error", message: "Failed to make appointment." })
			}
		})
	}

	useEffect(() => {
		FetchManager.fetch({
			url: HEALTH_PROFESSIONAL_TYPE_URL,
			success_cb: (res) => {
				setHealthprofessionaltypes(res.body);
				setIsLoading(false);
			}
		})
		FetchManager.fetch({
			url: HEALTH_PROFESSIONAL_URL,
			success_cb: (res) => {
				setHealthprofessionals(res.body);
				setIsLoading(false);
			}
		})
	});
	return (
		<Box component={"section"} sx={{ minHeight: "300px", minWidth: "500px" }}>
			{isLoading &&
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<CircularProgress />
				</Box>
			}
			{!isLoading && <Box component={"form"}>
				<Typography variant='h5' >Edit Session</Typography>
				<FormControl fullWidth sx={{ marginBottom: 2 }}>
					<TextField required id="patient" name="patient" label="Patient" disabled value={formData.patient} />
					<FormHelperText id="patient-helper-text">Patient in the session.</FormHelperText>
				</FormControl>
				<FormControl fullWidth sx={{ marginBottom: 2 }}>
					<TextField required id="healthProfessional" name="healthProfessional" label="Health Professional" onChange={handleFormChange} value={formData.healthProfessional} select>
						{healthprofessionals.map(item => (<MenuItem key={item._id} value={item._id}>{item.name.toLocaleUpperCase()}</MenuItem>))}
					</TextField>
					<FormHelperText id="HealthProfessional-helper-text">Choose the Health Professional for the session.</FormHelperText>
				</FormControl>
				<Box sx={{ marginTop: 2 }}>
					<FormControl fullWidth>
						<TextField required id="healthProfessionalType" name="healthProfessionalType" label="Health Professional Type" onChange={handleFormChange} value={formData.healthProfessionalType} select>
							{healthprofessionaltypes.map(item => (<MenuItem key={item._id} value={item._id}>{item.name.toLocaleUpperCase()}</MenuItem>))}
						</TextField>
						<FormHelperText id="HealthProfessionalType-helper-text">Choose the type of Health Professional you want to meet.</FormHelperText>
					</FormControl>
				</Box>
				<Box>
					<FormControl fullWidth>
						<TextField id="type" required name="type" onChange={handleFormChange} label="Type" value={formData.type} select>
							{types.map(item => (<MenuItem key={item} value={item}>{item.toLocaleUpperCase()}</MenuItem>))}
						</TextField>
						<FormHelperText id="type-helper-text">Type of session.</FormHelperText>
					</FormControl>
				</Box>
				<Box>
					<FormControl>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<TextField required inputProps={{ type: "date", min: new Date().toLocaleDateString() }} label="Date" id="date" value={formData.date} onChange={handleFormChange} name="date" aria-describedby="date" />
							<TextField required inputProps={{ type: "time" }} label="Time" id="time" name="time" value={formData.time} onChange={handleFormChange} aria-describedby="time" />
						</Box>
						<FormHelperText id="my-helper-text">Select data and time for session.</FormHelperText>
					</FormControl>
				</Box>
				<Box>
					<Button type="submit" onClick={handleSubmission}>Update</Button>
				</Box>
			</Box>
			}

		</Box>
	);
}

export default EditSessionForm;
