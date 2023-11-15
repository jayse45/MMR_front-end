import { FormControl, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import Button from '../Button';
import LoadingCircle from '../LoadingCircle';
import FetchManager from '../../utils/FetchManager';
import NotificationManager from '../../utils/NotificationManager';
import { UrlHelper } from '../../utils/UrlHelper';

const BodyParts_URL = UrlHelper.createApiUrlPath("/api/bodyParts/");

const EditBodyPart = ({ BodyPart }) => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: BodyPart.name,
		description: BodyPart.description,
	})
	const handleFormChange = (evt) => {
		setFormData({
			...formData,
			[evt.target.name]: evt.target.value
		})
	}
	const handleSubmission = (evt) => {
		evt.preventDefault();
		if (!formData.name || !formData.description) {
			NotificationManager.notifyUser({ message: "All fields are required.", type: "info" });
			return;
		}
		setLoading(true);
		FetchManager.fetch({
			url: BodyParts_URL + BodyPart._id,
			method: "PUT",
			body: formData,
			success_cb: (res) => {
				if (res.status === 200) {
					NotificationManager.notifyUser({ message: "Body part updated successfully", type: "success", toastId: 1 })
				} else {
					NotificationManager.notifyUser({ message: res.errors[0].msg, type: "info", toastId: 1 });
				}
				setLoading(false);
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ message: "Failed to update body part", type: "warning", toastId: 1 })
				setLoading(false);
			}
		})
	}

	return (
		<Box sx={{ minWidth: "500px" }}>
			{loading && <LoadingCircle />}
			{!loading &&
				<Box component="form">
					<Typography variant='subtile2' >Update: <i>{BodyPart.name}</i></Typography>
					<Box sx={{ marginTop: 2 }}>
						<FormControl fullWidth>
							<TextField size='small'  required id="name" name="name" placeholder="Name" onChange={handleFormChange} value={formData.name} />
						</FormControl>
					</Box>
					<Box sx={{ marginTop: 2, marginBottom: 2 }}>
						<FormControl fullWidth>
							<TextField multiline rows={3} size='small' required id="description"  name="description" placeholder="Description" onChange={handleFormChange} value={formData.description} />
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

export default EditBodyPart;
