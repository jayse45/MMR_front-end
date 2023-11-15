import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box, Grid, Skeleton, Typography, Divider } from '@mui/material';
import NavListItems from './components/NavListItems';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import { Cancel as CancelIcon, HourglassFull, PlayCircleFilled as PlayCircleFilledIcon } from '@mui/icons-material';
import NotificationManager from '../../utils/NotificationManager';
import { GridActionsCellItem } from '@mui/x-data-grid';
import LoadingCircle from '../../components/LoadingCircle';
import SessionCard from '../../components/SessionCard';
import { useNavigate } from "react-router-dom";
import CustomModal from '../../components/Modal/CustomModal';
import useAuth from '../../hooks/useAuth';
import PatientHistory from './components/PatientHistory';

const SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/users/");

const SessionsPage = () => {
	const navigate = useNavigate();
	let key = 0;
	const [sessions, setSessions] = useState([]);
	const [upcomingSessions, setUpcomingSessions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [upcomingLoading, setUpcomingLoading] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const { setOpenModal } = useAuth();
	const [actionRow, setActionRow] = useState("");

	const handleModalClose = () => {
		setOpenModal(false);
	}
	const viewPatientHistory = (row) => {
		console.log({row})
		return () => {
			setModalContent("history");
			setOpenModal(true);
			setActionRow(row)
		}
	}
	const cancelSession = () => {
		return () => NotificationManager.notifyUser({ type: "info", message: "Feature unavailable", duration: 1000, toastId: 1 });
	}
	const startSession = (row) => {
		return () => navigate(`/sessions/${row._id}`);
	}

	const headCells = [
		{ field: 'patient', headerName: 'Patient', width: 100 },
		{ field: 'type', headerName: 'Type', width: 80 },
		{ field: 'healthProfessionalType', headerName: 'Health Professional Type', width: 200 },
		{ field: 'date', headerName: 'Date', width: 100 },
		{ field: 'time', headerName: 'Time', width: 100 },
		{ field: 'status', headerName: 'Status', width: 100 },
		{
			field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
			getActions: (params) => [
				<GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={cancelSession(params.row)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<PlayCircleFilledIcon />} label="Start" onClick={startSession(params.row)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<HourglassFull />} label="History" onClick={viewPatientHistory(params.row)} key={params.id} showInMenu />
			],
		}];
	useEffect(() => {
		setLoading(true);
		setUpcomingLoading(true)
		FetchManager.fetch({
			url: SESSIONS_URL,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row?.healthProfessionalType?.name ?? "N/a";
					const healthProfessional = row?.healthProfessional?.name ?? "N/a";
					const patient = row?.patient?.name ?? "N/a";
					return {
						...row, healthProfessionalType, healthProfessional, patient,
						date: new Date(row.timestamp).toLocaleDateString(),
						time: new Date(row.timestamp).toLocaleTimeString()
					}
				})
				setSessions(rows);
				setLoading(false)
			}
		})
		FetchManager.fetch({
			url: `${SESSIONS_URL}upcoming`,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row.healthProfessionalType.name;
					const healthProfessional = row.healthProfessional.name;
					return {
						...row, healthProfessionalType, healthProfessional,
						date: new Date(row.timestamp).toLocaleDateString(),
						time: new Date(row.timestamp).toLocaleTimeString()
					}
				})
				setUpcomingSessions(rows);
				setUpcomingLoading(false)
			}
		})
	}, []);
	return (
		<Layout navList={NavListItems}>
			<Box component={"main"} >
				<Box component={"section"}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4} lg={3} xl={3}>
							<Typography variant='h6'>Upcoming Sessions</Typography>
							<Divider />
							{upcomingLoading ? <Skeleton variant='rectangular' height={120} width={"100%"} /> : 
								upcomingSessions.length === 0 ? <Typography variant='subtitle2'>No Sessions</Typography> :upcomingSessions.map(row => (
								<Box sx={{ marginBottom: 1 }} key={key++} > <SessionCard session={row} key={key++} /></Box>
							))}
						</Grid>
						<Grid item xs={12} md={8} lg={9} xl={9}>
							<Typography variant='h6'>All Sessions</Typography>
							{loading ? <LoadingCircle /> : <DataTable title={"Events"} columns={headCells} rows={sessions} pageSize={10} />}
						</Grid>
					</Grid>
				</Box>
				<CustomModal onClose={handleModalClose}>
					{modalContent === "history" && <Box sx={{ minWidth: "500px" }}>
						<Typography variant='h5'>Patient History</Typography>
						<PatientHistory userId={actionRow._id} />
					</Box>}
				</CustomModal>
			</Box>
		</Layout>
	);
}

export default SessionsPage;
