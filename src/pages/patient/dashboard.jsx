import { Grid, Typography, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Layout from '../../components/Layout/Layout';
import SimpleTable from '../../components/SimpleTable/SimpleTable';
import NavListItems from './components/NavListItems';
import styles from "./Patient.scss";
import { UrlHelper } from '../../utils/UrlHelper';
import {
	CalendarMonth as CalendarMonthIcon,
	PermContactCalendar as PermContactCalendarIcon,
} from '@mui/icons-material';
import FetchManager from '../../utils/FetchManager';

const APPOINTMENT_COUNT_URL = UrlHelper.createApiUrlPath("/api/appointments/users/count");
const RECENT_APPOINTMENT_URL = UrlHelper.createApiUrlPath("/api/appointments/users/paginate?limit=10&page=0");
const SESSION_COUNT_URL = UrlHelper.createApiUrlPath("/api/sessions/users/count");

const Dashboard = () => {
	const [appointments, setAppoinments] = useState([])
	const [appointmentCount, setAppoinmentCount] = useState("");
	const [sessionCount, setSessionCount] = useState("");

	const appointmentIndex = ["type", "healthProfessionalType", "date", "time"]
	const appointmentTitle = ["Type", "HealthProfessionalType", "Date", "Time"]

	useEffect(() => {
		FetchManager.fetch({
			url: APPOINTMENT_COUNT_URL,
			success_cb: (res) => {
				setAppoinmentCount(res.body.count);
			}
		})
		FetchManager.fetch({
			url: SESSION_COUNT_URL,
			success_cb: (res) => {
				setSessionCount(res.body.count)
			}
		})
		FetchManager.fetch({
			url: RECENT_APPOINTMENT_URL,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row.healthProfessionalType.name.toLocaleUpperCase();
					return {
						...row,
						healthProfessionalType,
						date: new Date(row.timestamp).toLocaleDateString(),
						time: new Date(row.timestamp).toLocaleTimeString()
					}
				})
				setAppoinments(rows);
			}
		})
	}, []);
	return <Layout navList={NavListItems} page={"Dashboard"}>
		<Box component={"main"} className={styles.main} >
			<Box component={"section"} className={styles.TopSection} >
				<Grid container spacing={4}>
					<Grid item xs={7} md={4} lg={3}>
						<DashboardCard link='/appointments' Icon={<CalendarMonthIcon />} number={appointmentCount} text="appointments" />
					</Grid>
					<Grid item xs={7} md={4} lg={3}>
						<DashboardCard link='/sessions' Icon={<PermContactCalendarIcon />} number={sessionCount} text="sessions" />
					</Grid>
				</Grid>
			</Box>
			<Box component={"section"} sx={{ marginTop: 2 }}>
				<Grid container spacing={5}>
					<Grid item xs={10} md={8} lg={6}>
						<SimpleTable itemIndex={appointmentIndex} titles={appointmentTitle} rows={appointments} />
					</Grid>
					<Grid item xs={10} md={8} lg={6}>
						<Paper sx={{ padding: 2 }}>
							<Typography>Subscription Info</Typography>
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</Box>
	</Layout>
}

export default Dashboard;
