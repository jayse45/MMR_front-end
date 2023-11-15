import { Box, FormControl, FormHelperText, TextField, MenuItem, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import FetchManager from '../../../utils/FetchManager';
import NotificationManager from '../../../utils/NotificationManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import Button from '../../../components/Button';

const PATIENTS_URL = UrlHelper.createApiUrlPath("/api/users?role=ind");
const APPOINTMENT_URL = UrlHelper.createApiUrlPath("/api/appointments/users");

const now = new Date();
const dateString = `${now.getFullYear()}-${now.getMonth().toLocaleString('en', { minimumIntegerDigits: 2 })}-${now.getDate().toLocaleString('en', { minimumIntegerDigits: 2 })}`;
const timeString = `${now.getHours().toLocaleString('en', { minimumIntegerDigits: 2 })}:${now.getMinutes().toLocaleString('en', { minimumIntegerDigits: 2 })}`;

const EditAppointmentForm = ({ row }) => {
	const [patients, setPatients] = useState([]);
	const [formData, setFormData] = useState({
		healthProfessionalType: "",
		type: "online",
		patient: "",
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
			url: APPOINTMENT_URL,
			body: data,
			method: "POST",
			success_cb: (res) => {
				if (res.status) {
					NotificationManager.notifyUser({ type: "success", message: "Appointment made successfully." })
					window.location.reload();
				} else {
					setIsLoading(false);
					NotificationManager.notifyUser({ type: "warning", message: "Failed to make appointment." })
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
			url: PATIENTS_URL,
			success_cb: (res) => {
				setPatients(res.body);
				setIsLoading(false);
			}
		})

	}, []);
	return (
		<Box component={"section"} sx={{ minHeight: "300px", minWidth: "500px" }}>
			{isLoading &&
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
					<CircularProgress />
				</Box>
			}
			{!isLoading && <Box component={"form"}>
				<Typography variant='h5' >Request Appointment</Typography>
				<Box sx={{ marginTop: 2 }}>
					<FormControl fullWidth>
						<TextField required id="patient" name="patient" label="patient" onChange={handleFormChange} select value={formData.patient}>
							{patients.map(item => (<MenuItem key={item._id} value={item._id}>{item.name.toLocaleUpperCase()}</MenuItem>))}
						</TextField>
						<FormHelperText id="patient-helper-text">Patient you are creating appointment for.</FormHelperText>
					</FormControl>
				</Box>
				<Box>
					<FormControl fullWidth>
						<TextField id="type" required name="type" onChange={handleFormChange} label="Type" value={formData.type} select>
							{types.map(item => (<MenuItem key={item} value={item}>{item.toLocaleUpperCase()}</MenuItem>))}
						</TextField>
						<FormHelperText id="type-helper-text">Type of appointment.</FormHelperText>
					</FormControl>
				</Box>
				<Box>
					<FormControl>
						<Box sx={{ display: "flex", justifyContent: "space-between" }}>
							<TextField required inputProps={{ type: "date", min: new Date().toLocaleDateString() }} label="Date" id="date" value={formData.date} onChange={handleFormChange} name="date" aria-describedby="date" />
							<TextField required inputProps={{ type: "time" }} label="Time" id="time" name="time" value={formData.time} onChange={handleFormChange} aria-describedby="time" />
						</Box>
						<FormHelperText id="my-helper-text">Select data and time for appointment.</FormHelperText>
					</FormControl>
				</Box>
				<Box>
					<Button type="submit" onClick={handleSubmission}>Make Appointment</Button>
				</Box>
			</Box>
			}

		</Box>
	);
}

export default EditAppointmentForm;
