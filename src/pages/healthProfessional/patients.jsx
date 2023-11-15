import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box, Typography } from '@mui/material';
import NavListItems from './components/NavListItems';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import { HourglassBottom as HourglassBottomIcon, Edit as EditIcon, Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import NotificationManager from '../../utils/NotificationManager';
import { GridActionsCellItem } from '@mui/x-data-grid';
import LoadingCircle from '../../components/LoadingCircle';
import ViewUser from '../../components/Users/ViewUser';
import DeleteUser from '../../components/Users/DeleteUser';
import EditUser from '../../components/Users/EditUser';
import CustomModal from '../../components/Modal/CustomModal';
import useAuth from '../../hooks/useAuth';
import ModalButton from '../../components/Modal/ModalButton';
import AddUser from './components/Users/AddUser';
import ConfigurationManager from '../../utils/ConfigurationManager';
import PatientHistory from './components/PatientHistory';

const USERS_URL = UrlHelper.createApiUrlPath("/api/users/users");

const PatientsPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const { setOpenModal } = useAuth();
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
	const [reload, setReload] = useState(false);

	const reloadPage = () => {
		setReload(!reload);
	}

	const handleModalClose = () => {
		setOpenModal(false);
	}

	const deleteUser = (params) => {
		return () => {
			setModalContent("delete");
			setOpenModal(true);
			setActionRow(params.row)
		}
	}
	const viewUser = (params) => {
		return () => {
			setModalContent("view");
			setOpenModal(true);
			setActionRow(params.row)
		}
	}
	const viewUserHistory = (params) => {
		return () => {
			setModalContent("history");
			setOpenModal(true);
			setActionRow(params.row)
		}
	}
	const editUser = (params) => {
		return () => {
			setModalContent("edit");
			setOpenModal(true);
			setActionRow(params.row)
			NotificationManager.notifyUser({ type: "info", message: "Feature unavailable", duration: 1000, toastId: 1 });
		}
	}

	const headCells = [
		{ field: 'name', headerName: 'Name', width: 200 },
		{ field: 'email', headerName: 'Email', width: 200 },
		{ field: 'createdAt', headerName: 'createdAt', width: 200 },
		{ field: 'updatedAt', headerName: 'updatedAt', width: 200 },
		{ field: 'status', headerName: 'Status', width: 150 },
		{
			field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
			getActions: (params) => [
				<GridActionsCellItem icon={<HourglassBottomIcon />} label="History" onClick={viewUserHistory(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<VisibilityIcon />} label="View" onClick={viewUser(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={< EditIcon />} label="Edit" onClick={editUser(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={deleteUser(params)} key={params.id} showInMenu />,
			],
		},
	];

	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: USERS_URL,
			success_cb: (res) => {
				setUsers(res.body);
				setLoading(false)
			}
		})
	}, [reload]);
	return (
		<Layout navList={NavListItems}>
			<Box component={"main"} >
				<Box component={"section"} sx={{ display: "flex", justifyContent: "flex-end" }}>
					<ModalButton text={"Add User"}>
						<AddUser role={ConfigurationManager.getConfig("ROLES")["PATIENT"]} />
					</ModalButton>
				</Box>
				<Box component={"section"}>
					{loading ?
						<LoadingCircle />
						: <Box>
							<DataTable title={"Patients"} columns={headCells} rows={users} pageSize={10} />
						</Box>
					}
				</Box>
			</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "edit" && <EditUser onClose={reloadPage} user={actionRow} />}
				{modalContent === "delete" && <DeleteUser onClose={reloadPage} user={actionRow} />}
				{modalContent === "history" && <Box sx={{minWidth: "500px"}}>
					<Typography variant='h5'>Patient History</Typography>
					<PatientHistory userId={actionRow._id} />
				</Box>}
				{modalContent === "view" && <ViewUser user={actionRow} />}
			</CustomModal>
		</Layout>
	);
}

export default PatientsPage;

