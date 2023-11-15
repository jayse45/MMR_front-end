import {CircularProgress, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import Button from '../../../../../components/Button';
import FetchManager from '../../../../../utils/FetchManager';
import NotificationManager from '../../../../../utils/NotificationManager';
import { UrlHelper } from '../../../../../utils/UrlHelper';

const HealthProfessionalTypes_URL = UrlHelper.createApiUrlPath("/api/healthProfessionalTypes/");

const DeleteHealthProfessionalType = ({ healthProfessionalType, onClose }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmission = () => {
		setIsLoading(true);
		FetchManager.fetch({
			url: HealthProfessionalTypes_URL + healthProfessionalType._id,
			method: "DELETE",
			success_cb: (res) => {
				if (res.status === 200) {
					NotificationManager.notifyUser({ type: "success", message: "Health professional type deleted", toastId: 1 })
					window.location.reload();
				} else {
					setIsLoading(false);
					NotificationManager.notifyUser({ type: "warning", message: "Failed to delete health professional type", toastId: 1 })
				}
			},
			failure_cb: (res) => {
				setIsLoading(false);
				NotificationManager.notifyUser({ type: "error", message: "Failed to delete health professional type", toastId: 1 })
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
					<Typography variant="h6">Are you sure want to delete <i>{healthProfessionalType.name}</i>? </Typography>
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

export default DeleteHealthProfessionalType;
