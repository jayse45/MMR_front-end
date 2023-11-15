import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box } from '@mui/material';
import NavListItems from './components/NavListItems';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationManager from '../../utils/NotificationManager';
import { GridActionsCellItem } from '@mui/x-data-grid';
import ModalButton from '../../components/Modal/ModalButton';
import LoadingCircle from '../../components/LoadingCircle';
import MakeAppointmentForm from './components/MakeAppointmentForm';
import EditAppointmentForm from './components/EditAppointmentForm';
import ApproveAppointmentForm from './components/ApproveAppointmentForm';
import DeclineAppointmentForm from './components/DeclineAppointmentForm';
import CustomModal from '../../components/Modal/CustomModal';
import useAuth from '../../hooks/useAuth';

const USERS_APPOINTMENTS_URL = UrlHelper.createApiUrlPath("/api/appointments/users");

const AppointmentPage = () => {
	const [appointments, setAppoinments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
	const { setOpenModal } = useAuth();

	const handleModalClose = () => {
		setOpenModal(false);
	}

	const approveAppointment = (params) => {
		return () => {
			if (["approved", "declined"].includes(params.row.status)) {
				return NotificationManager.notifyUser({ type: "info", message: "Action unavailable", duration: 1000, toastId: 1 });
			}
			setModalContent("approval");
			setOpenModal(true);
			setActionRow(params.row)
			return true;
		}
	}

	const declineAppointment = (params) => {
		return () => {
			if (["approved", "declined"].includes(params.row.status)){
				return NotificationManager.notifyUser({ type: "info", message: "Action unavailable", duration: 1000, toastId: 1 });
			}
			setModalContent("declined");
			setOpenModal(true);
			setActionRow(params.row)
			return true;
		}
	}

	const editAppointment = (params) => {
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
				<GridActionsCellItem icon={<CheckCircleIcon />} label="Approve" onClick={approveAppointment(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<CancelIcon />} label="Decline" onClick={declineAppointment(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={editAppointment(params)} key={params.id} showInMenu />,
			],
		},
	];

	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: USERS_APPOINTMENTS_URL,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row?.healthProfessionalType?.name ?? "N/a";
					const patient = row?.patient?.name ?? "N/a";
					return {
						...row,
						healthProfessionalType,
						patient,
						date: new Date(row.timestamp).toLocaleDateString([], { dateStyle: 'medium' }),
						time: new Date(row.timestamp).toLocaleTimeString([], { timeStyle: 'short' })
					}
				})
				setAppoinments(rows);
				setLoading(false)
			}
		})
	}, []);
	return (
		<Layout navList={NavListItems}>
			<Box component={"main"}>
				<Box component={"section"} sx={{display: "flex", justifyContent: "flex-end" }}>
					<ModalButton text={"Make Appointment"}>
						<MakeAppointmentForm />
					</ModalButton>
				</Box>
				<Box component={"section"} sx={{ marginTop: 2 }}>
					{loading ?
						<LoadingCircle />
						: <DataTable title={"Events"} columns={headCells} rows={appointments} pageSize={10} />
					}
				</Box>
			</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "approval" && <ApproveAppointmentForm row={actionRow} />}
				{modalContent === "edit" && <EditAppointmentForm row={actionRow} />}
				{modalContent === "declined" && <DeclineAppointmentForm onClose={handleModalClose} row={actionRow} />}
			</CustomModal>
		</Layout>
	);
}

export default AppointmentPage;
