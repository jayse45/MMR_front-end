import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box } from '@mui/material';
import NavListItems from './components/NavListItems';
import styles from "./Patient.scss";
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationManager from '../../utils/NotificationManager';
import { GridActionsCellItem } from '@mui/x-data-grid';
import RequestAppointmentForm from '../../components/AppointmentForm/RequestAppointmentForm';
import LoadingCircle from '../../components/LoadingCircle';
import ModalButton from '../../components/Modal/ModalButton';

const APPOINTMENTS_URL = UrlHelper.createApiUrlPath("/api/appointments/users/");

const AppointmentPage = () => {
	const [appointments, setAppoinments] = useState([]);
	const [loading, setLoading] = useState(false);
	const deleteAppointment = () => {
		return () => NotificationManager.notifyUser({ type: "info", message: "Feature unavailable", duration: 1000, toastId: 1 });
	}
	const editAppointment = () => {
		return () => NotificationManager.notifyUser({ type: "info", message: "Feature unavailable", duration: 1000, toastId: 1 });
	}
	const headCells = [{ field: 'type', headerName: 'Type', width: 150 },
	{ field: 'healthProfessionalType', headerName: 'Health Professional Type', width: 200 },
	{ field: 'date', headerName: 'Date', width: 150 },
	{ field: 'time', headerName: 'Time', width: 150 },
	{ field: 'status', headerName: 'Status', width: 150 },
	{
		field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
		getActions: (params) => [
			<GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={deleteAppointment(params)} key={params.id} showInMenu />,
			<GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={editAppointment(params)} key={params.id} showInMenu />,
		],
	}];
	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: APPOINTMENTS_URL,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row?.healthProfessionalType?.name ?? "N/a";
					return {
						...row,
						healthProfessionalType,
						date: new Date(row.timestamp).toLocaleDateString(),
						time: new Date(row.timestamp).toLocaleTimeString()
					}
				})
				setAppoinments(rows);
				setLoading(false)
			}
		})
	}, []);
	return (
		<Layout navList={NavListItems}>
			<Box component={"main"} className={styles.main} >
				<Box component={"section"} sx={{ display: "flex", justifyContent: "flex-end" }}>
					<ModalButton text={"Request Appointment"}>
						<RequestAppointmentForm />
					</ModalButton>
				</Box>
				<Box component={"section"} sx={{ marginTop: 2 }}>
					{loading ?
						<LoadingCircle />
						: <DataTable title={"Events"} columns={headCells} rows={appointments} pageSize={10} />
					}
				</Box>
			</Box>
		</Layout>
	);
}

export default AppointmentPage;
