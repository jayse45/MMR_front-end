import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box, Grid, Skeleton, Typography, Divider } from '@mui/material';
import NavListItems from './components/NavListItems';
import styles from "./Patient.scss";
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import CancelIcon from '@mui/icons-material/Cancel';
import NotificationManager from '../../utils/NotificationManager';
import { GridActionsCellItem } from '@mui/x-data-grid';
import LoadingCircle from '../../components/LoadingCircle';
import SessionCard from '../../components/SessionCard';

const SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/users/");

const SessionsPage = () => {
	let key = 0;
	const [sessions, setSessions] = useState([]);
	const [upcomingSessions, setUpcomingSessions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [upcomingLoading, setUpcomingLoading] = useState(false);

	const cancelAppointment = () => {
		return () => NotificationManager.notifyUser({ type: "info", message: "Feature unavailable", duration: 1000, toastId: 1 });
	}

	const headCells = [{ field: 'healthProfessional', headerName: 'Health Professional', width: 200 },
	{ field: 'type', headerName: 'Type', width: 150 },
	{ field: 'healthProfessionalType', headerName: 'Health Professional Type', width: 200 },
	{ field: 'date', headerName: 'Date', width: 100 },
	{ field: 'time', headerName: 'Time', width: 100 },
	{ field: 'status', headerName: 'Status', width: 100 },
	{
		field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
		getActions: (params) => [
			<GridActionsCellItem icon={<CancelIcon />} label="Delete" onClick={cancelAppointment(params)} key={params.id} showInMenu />
		],
	}];
	useEffect(() => {
		setLoading(true);
		setUpcomingLoading(true);
		FetchManager.fetch({
			url: SESSIONS_URL,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row?.healthProfessionalType?.name ?? "N/a";
					const healthProfessional = row?.healthProfessional?.name ?? "N/a";
					return {
						...row, healthProfessionalType, healthProfessional,
						date: new Date(row.timestamp).toLocaleDateString(),
						time: new Date(row.timestamp).toLocaleTimeString()
					}
				})
				setSessions(rows);
				setLoading(false)
			}
		})
		FetchManager.fetch({
			url: SESSIONS_URL + "upcoming",
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
		<Layout navList={NavListItems} page={"sessions"}>
			<Box component={"main"} className={styles.main} >
				<Box component={"section"}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={4} lg={3} xl={3}>
							<Typography variant='h6'>Upcoming Sessions</Typography>
							<Divider />
							{upcomingLoading ? <Skeleton variant='rectangular' height={120} width={"100%"} /> :
								upcomingSessions.length === 0 ? <Typography variant='subtitle2'>No Sessions</Typography> : upcomingSessions.map(row => (
									<Box sx={{ marginBottom: 1 }} key={key++} > <SessionCard session={row} key={key++} /></Box>
								))}
						</Grid>
						<Grid item xs={12} md={8} lg={9} xl={9}>
							<Typography variant='h6'>All Sessions</Typography>
							{loading ? <LoadingCircle /> : <DataTable title={"Events"} columns={headCells} rows={sessions} pageSize={10} />}
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Layout>
	);
}

export default SessionsPage;
