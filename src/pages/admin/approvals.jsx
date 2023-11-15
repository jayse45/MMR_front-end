import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box, Paper, TextField, Typography } from '@mui/material';
import NavListItems from './components/NavListItems';
import styles from "./Admin.scss";
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import LoadingCircle from '../../components/LoadingCircle';
import CustomModal from '../../components/Modal/CustomModal';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/Button';
import NotificationManager from '../../utils/NotificationManager';

const USERS_URL = UrlHelper.createApiUrlPath("/api/users/");

const ApprovalsPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const { setOpenModal } = useAuth();
	const [actionRow, setActionRow] = useState("");
	const [reason, setReason] = useState("");
	const [reload, setReload] = useState(false);

	const handleModalClose = () => {
		setReason("");
		setOpenModal(false);
	}
	const approve = () => {
		setLoading(true)
		FetchManager.fetch({
			url: `${USERS_URL}${actionRow._id}/approveLicense`,
			method: "PUT",
			success_cb: (res) => {
				NotificationManager.notifyUser({ message: res.message, type: "success" })
				setReload(!reload);
				handleModalClose()
				setLoading(false)
			},
			failure_cb: (res) => {
				setLoading(false)
			}
		})
	}

	const decline = () => {

		if (reason === "") {
			NotificationManager.notifyUser({ message: "For rejection, you need to provide a comment to the user", type: "info" })
		} else {
			setLoading(true)
			FetchManager.fetch({
				url: `${USERS_URL}${actionRow._id}/rejectLicense`,
				method: "PUT",
				body: {
					verify: false,
					reason
				},
				success_cb: (res) => {
					NotificationManager.notifyUser({ message: res.message, type:"success" })
					setReload(!reload);
					handleModalClose();
					setLoading(false)
				},
				failure_cb: (res) => {
					setLoading(false)
				}
			})
		}
	}

	const showUser = (params) => {
		return () => {
			setOpenModal(true);
			setActionRow(params.row)
		}
	}

	const headCells = [
		{ field: 'name', headerName: 'Name', width: 300 },
		{ field: 'email', headerName: 'Email', width: 300 },
		{ field: 'status', headerName: 'Status', width: 150 },
		{
			field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
			getActions: (params) => [
				<GridActionsCellItem icon={< VisibilityIcon />} label="View License" onClick={showUser(params)} key={params.id} showInMenu />,
			],
		},
	];

	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: `${USERS_URL}unApprovedHealthProfessionals`,
			success_cb: (res) => {
				setUsers(res.body);
				setLoading(false)
			}
		})
	}, [reload]);
	return (
		<Layout navList={NavListItems}>
			<Box component={"main"} className={styles.main} >
				<Box component={"section"}>
					{loading ?
						<LoadingCircle />
						: <DataTable title={"Users"} columns={headCells} rows={users} pageSize={10} />
					}
				</Box>
			</Box>
			<CustomModal onClose={handleModalClose}>
				<Box p={2}>
					<Paper p={1}>
						<Box sx={{ width: "500px", height: "300px", objectFit: "contain" }} component={"img"} src={actionRow?.healthProfessionalExtraData?.licensePicture?.url ?? ""} alt="License Uploaded by health professional" />
					</Paper>
					<Box mt={1}>
						<TextField disabled={loading} fullWidth rows={2} onChange={(evt) => { setReason(evt.target.value) }} multiline label="comment" value={reason} />
					</Box>
					<Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-around", paddingRight: 4 }} >
						<Typography mt={2} variant="body1">Approve license? </Typography>
						<Button loading={loading} variant={"outlined"} onClick={decline}>No</Button>
						<Button loading={loading} onClick={approve}>Yes</Button>
					</Box>
				</Box>
			</CustomModal>
		</Layout>
	);
}

export default ApprovalsPage;

