import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box } from '@mui/material';
import NavListItems from './components/NavListItems';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import {Edit as EditIcon, Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import NotificationManager from '../../utils/NotificationManager';
import { GridActionsCellItem } from '@mui/x-data-grid';
import LoadingCircle from '../../components/LoadingCircle';
import ViewUser from '../../components/Users/ViewUser';
import DeleteUser from '../../components/Users/DeleteUser';
import EditUser from '../../components/Users/EditUser';
import AddUser from '../../components/Users/AddUser';
import ConfigurationManager from '../../utils/ConfigurationManager';
import CustomModal from '../../components/Modal/CustomModal';
import useAuth from '../../hooks/useAuth';
import ModalButton from '../../components/Modal/ModalButton';

const USERS_URL = UrlHelper.createApiUrlPath("/api/users/users");

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const {setOpenModal} = useAuth();
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
	const [reload, setReload] = useState(false);

	const handleModalClose = () => {
		setReload(!reload);
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
		{ field: 'role', headerName: 'Role', width: 100 }, 
		{ field: 'createdAt', headerName: 'createdAt', width: 150 },
		{ field: 'updatedAt', headerName: 'updatedAt', width: 150 },
		{ field: 'status', headerName: 'Status', width: 150 },
		{
			field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
			getActions: (params) => [
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
		<Layout navList={NavListItems} page={"Health Professionals"}>
			<Box component={"main"}>
				<Box component={"section"} sx={{ display: "flex", justifyContent: "flex-end" }}>
					<ModalButton title="Add new user to account" text={"Add Health Professional"}>
						<AddUser role={ConfigurationManager.getConfig("ROLES").HEALTH_PROFESSIONAL}/>
					</ModalButton>
				</Box>
				<Box component={"section"} sx={{ marginTop: 2 }}>
					{loading ?
						<LoadingCircle />
						: <DataTable title={"Health Professional"} columns={headCells} rows={users} pageSize={10} />
					}
				</Box>
			</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "view" && <ViewUser user={actionRow} />}
				{modalContent === "edit" && <EditUser user={actionRow} />}
				{modalContent === "delete" && <DeleteUser onClose={handleModalClose} user={actionRow} />}
			</CustomModal>
		</Layout>
	);
}

export default UsersPage;

