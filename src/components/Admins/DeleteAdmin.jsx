import { Box, CircularProgress, Typography } from '@mui/material';
import {useState} from 'react';
import FetchManager from '../../utils/FetchManager';
import NotificationManager from '../../utils/NotificationManager';
import { UrlHelper } from '../../utils/UrlHelper';
import Button from '../Button';

const ADMIN_URL = UrlHelper.createApiUrlPath("/api/admins/")

const DeleteAdmin = ({ admin, onClose }) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmission = () => {
		setIsLoading(true);
		FetchManager.fetch({
			url: ADMIN_URL + admin._id,
			method: "DELETE",
			success_cb: (res) => {
				if (res.status === 200 && res.body.deleted > 0) {
					NotificationManager.notifyUser({ type: "success", message: "Admin deleted successfully.", toastId: 1 })
					window.location.reload();
				} else {
					setIsLoading(false);
					NotificationManager.notifyUser({ type: "warning", message: "Failed to delete admin.", toastId: 1 })
				}
			},
			failure_cb: () => {
				setIsLoading(false);
				NotificationManager.notifyUser({ type: "error", message: "Failed to delete admin.", toastId: 1 })
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
					<Typography variant="h6">Are you sure want to delete admin <i>{admin.name}</i>? </Typography>
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

export default DeleteAdmin;
