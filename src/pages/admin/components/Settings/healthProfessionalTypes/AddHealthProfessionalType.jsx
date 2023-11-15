import { FormControl, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import Button from '../../../../../components/Button';
import LoadingCircle from '../../../../../components/LoadingCircle';
import FetchManager from '../../../../../utils/FetchManager';
import NotificationManager from '../../../../../utils/NotificationManager';
import { UrlHelper } from '../../../../../utils/UrlHelper';

const HealthProfessionalTypes_URL = UrlHelper.createApiUrlPath("/api/healthProfessionalTypes");

const AddHealthProfessionalType = ({ onClose = () => {/*empty to prevent null calls*/ } }) => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
	})
	const handleFormChange = (evt) => {
		setFormData({
			...formData,
			[evt.target.name]: evt.target.value
		})
	}
	const handleSubmission = (evt) => {
		evt.preventDefault();
		setLoading(true);
		FetchManager.fetch({
			url: HealthProfessionalTypes_URL,
			method: "POST",
			body: formData,
			success_cb: (res) => {
				if (res.status === 201) {
					NotificationManager.notifyUser({ message: "Health Professional Type created successfully", type: "success", toastId: 1 })
					onClose();
				} else {
					NotificationManager.notifyUser({ message: res.errors[0].msg, type: "info", toastId: 1 });
					setLoading(false);
				}
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ message: "Failed to create Health Professional Type", type: "warning", toastId: 1 })
				setLoading(false);
			}
		})
	}

	return (
		<Box sx={{ minWidth: "500px" }}>
			{loading && <LoadingCircle />}
			{!loading &&
				<Box component="form">
					<Typography variant='h5' >Add Health Professional Type</Typography>
					<Box sx={{ marginTop: 2 }}>
						<FormControl fullWidth>
							<TextField size='small'  required id="name" name="name" placeholder="Name" onChange={handleFormChange} value={formData.name} />
						</FormControl>
					</Box>
					<Box sx={{ marginTop: 2, marginBottom: 2 }}>
						<FormControl fullWidth>
							<TextField multiline={3} size='small' required id="description"  name="description" placeholder="Description" onChange={handleFormChange} value={formData.description} />
						</FormControl>
					</Box>
					<Box>
						<Button type="submit" onClick={handleSubmission}>Create</Button>
					</Box>
				</Box>
			}
		</Box>
	);
}

export default AddHealthProfessionalType;
