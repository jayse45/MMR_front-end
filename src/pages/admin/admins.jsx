import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box } from '@mui/material';
import NavListItems from './components/NavListItems';
import styles from "./Admin.scss";
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import { Edit as EditIcon, Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import NotificationManager from '../../utils/NotificationManager';
import { GridActionsCellItem } from '@mui/x-data-grid';
import LoadingCircle from '../../components/LoadingCircle';
import ViewAdmin from '../../components/Admins/ViewAdmin';
import DeleteAdmin from '../../components/Admins/DeleteAdmin';
import EditAdmin from '../../components/Admins/EditAdmin';
import useAuth from '../../hooks/useAuth';
import CustomModal from '../../components/Modal/CustomModal';
import ModalButton from '../../components/Modal/ModalButton';
import AddAdmin from '../../components/Admins/AddAdmin';

const ADMINS_URL = UrlHelper.createApiUrlPath("/api/admins/");

const AdminsPage = () => {
	const [admins, setAdmins] = useState([]);
	const [loading, setLoading] = useState(false);
	const { setOpenModal } = useAuth();
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
	const [reload, setReload] = useState(false);

	const handleModalClose = () => {
		setReload(!reload);
		setOpenModal(false);
	}

	const deleteAdmin = (params) => {
		return () => {
			setModalContent("delete");
			setOpenModal(true);
			setActionRow(params.row)
		}
	}
	const viewAdmin = (params) => {
		return () => {

			setModalContent("view");
			setOpenModal(true);
			setActionRow(params.row)
		}
	}
	const editAdmin = (params) => {
		return () => {
			setModalContent("edit");
			setOpenModal(true);
			setActionRow(params.row)
			NotificationManager.notifyAdmin({ type: "info", message: "Feature unavailable", duration: 1000, toastId: 1 });
		}
	}

	const headCells = [
		{ field: 'name', headerName: 'Name', width: 200 },
		{ field: 'email', headerName: 'Email', width: 200 },
		{ field: 'gender', headerName: 'Gender', width: 100 },
		{ field: 'createdAt', headerName: 'createdAt', width: 150 },
		{ field: 'updatedAt', headerName: 'updatedAt', width: 150 },
		{ field: 'status', headerName: 'Status', width: 150 },
		{
			field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
			getActions: (params) => [
				<GridActionsCellItem icon={<VisibilityIcon />} label="View" onClick={viewAdmin(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={< EditIcon />} label="Edit" onClick={editAdmin(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={deleteAdmin(params)} key={params.id} showInMenu />,
			],
		},
	];

	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: ADMINS_URL,
			success_cb: (res) => {
				setAdmins(res.body);
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
						: <>
							<Box component={"section"} sx={{ display: "flex", justifyContent: "flex-end" }} mb={2}>
								<ModalButton text={"Add Admin"}>
									<AddAdmin />
								</ModalButton>
							</Box>
							<DataTable title={"Admins"} columns={headCells} rows={admins} pageSize={10} />
						</>
					}
				</Box>
			</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "view" && <ViewAdmin admin={actionRow} />}
				{modalContent === "edit" && <EditAdmin admin={actionRow} />}
				{modalContent === "delete" && <DeleteAdmin onClose={handleModalClose} admin={actionRow} />}
			</CustomModal>
		</Layout>
	);
}

export default AdminsPage;

