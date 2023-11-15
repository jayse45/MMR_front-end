import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box } from '@mui/material';
import NavListItems from './components/NavListItems';
import styles from "./Admin.scss";
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import { Edit as EditIcon, Cancel as CancelIcon } from '@mui/icons-material';
import NotificationManager from '../../utils/NotificationManager';
import { GridActionsCellItem } from '@mui/x-data-grid';
import LoadingCircle from '../../components/LoadingCircle';
import CancelSessionForm from '../../components/Sessions/CancelSession';
import EditSessionForm from '../../components/Sessions/EditSession';
import CustomModal from '../../components/Modal/CustomModal';
import useAuth from '../../hooks/useAuth';

const SESSION_URL = UrlHelper.createApiUrlPath("/api/sessions/");

const SessionsPage = () => {
	const [session, setSessions] = useState([]);
	const [loading, setLoading] = useState(false);
	const {setOpenModal} = useAuth();
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
	const [reload, setReload] = useState(false);

	const handleModalClose = () => {
		setReload(!reload);
		setOpenModal(false);
	}

	const canceleSession = (params) => {
		return () => {
			if (params.timestamp < Date.now()){
				return NotificationManager.notifyUser({ type: "info", message: "Can't cancel a past session", duration: 1000, toastId: 1 });
			}
			setModalContent("cancel");
			setOpenModal(true);
			setActionRow(params.row)
			return true;
		}
	}

	const editSession = (params) => {
		return () => {
			setModalContent("edit");
			setOpenModal(true);
			setActionRow(params.row)
			NotificationManager.notifyUser({ type: "info", message: "Feature unavailable", duration: 1000, toastId: 1 });
		}
	}

	const headCells = [
		{ field: 'patient', headerName: 'Patient', width: 200 },
		{ field: 'type', headerName: 'Type', width: 100 },
		{ field: 'healthProfessionalType', headerName: 'Health Professional Type', width: 200 },
		{ field: 'date', headerName: 'Date', width: 150 },
		{ field: 'time', headerName: 'Time', width: 150 },
		{ field: 'status', headerName: 'Status', width: 150 },
		{
			field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
			getActions: (params) => [
				<GridActionsCellItem icon={<CancelIcon />} label="Decline" onClick={canceleSession(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={editSession(params)} key={params.id} showInMenu />,
			],
		},
	];

	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: SESSION_URL,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row?.healthProfessionalType?.name ?? "N/a";
					const healthProfessional = row?.healthProfessional?.name ?? "N/a";
					const patient = row?.patient?.name ?? "N/a";
					return {
						...row,
						healthProfessionalType,
						healthProfessional,
						patient,
						healthProfessionalType_id: row?.healthProfessionalType?._id ?? "N/a",
						healthProfessional_id: row?.healthProfessional?._id ?? "N/a",
						patient_id: row?.patient?._id ?? "N/a",
						date: new Date(row.timestamp).toLocaleDateString([], { dateStyle: 'medium' }),
						time: new Date(row.timestamp).toLocaleTimeString([], { timeStyle: 'short' })
					}
				})
				setSessions(rows);
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
						: <DataTable title={"Events"} columns={headCells} rows={session} pageSize={10} />
					}
				</Box>
			</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "edit" && <EditSessionForm session={actionRow} />}
				{modalContent === "cancel" && <CancelSessionForm onClose={handleModalClose} session={actionRow} />}
			</CustomModal>
		</Layout>
	);
}

export default SessionsPage;
