import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Layout from '../../components/Layout/Layout';
import SimpleTable from '../../components/SimpleTable/SimpleTable';
import NavListItems from './components/NavListItems';
import styles from "./Admin.scss";
import { UrlHelper } from '../../utils/UrlHelper';
import {
	CalendarMonth as CalendarMonthIcon,
	PermContactCalendar as PermContactCalendarIcon,
	Person as PersonIcon,
	Payment as PaymentIcon,
	FitnessCenter as FitnessCenterIcon

} from '@mui/icons-material';
import FetchManager from '../../utils/FetchManager';

const APPOINTMENT_COUNT_URL = UrlHelper.createApiUrlPath("/api/appointments/count");
const EXERCISES_COUNT_URL = UrlHelper.createApiUrlPath("/api/exercises/count");
const USERS_COUNT_URL = UrlHelper.createApiUrlPath("/api/users/count");
const ADMINS_COUNT_URL = UrlHelper.createApiUrlPath("/api/admins/count");
const RECENT_APPOINTMENT_URL = UrlHelper.createApiUrlPath("/api/appointments/paginate?limit=5&page=0");
const RECENT_SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/paginate?limit=5&page=0");
const SESSION_COUNT_URL = UrlHelper.createApiUrlPath("/api/sessions/count");

const Dashboard = () => {
	const [appointments, setAppoinments] = useState([]);
	const [sessions, setSessions] = useState([]);
	const [appointmentCount, setAppoinmentCount] = useState("");
	const [sessionCount, setSessionCount] = useState("");
	const [userCount, setUserCount] = useState("");
	const [adminCount, setAdminCount] = useState("");
	const [exerciseCount, setExerciseCount] = useState("");

	const appointmentIndex = ["patient", "type", "healthProfessionalType", "date"]
	const sessionIndex = ["patient", "type", "healthProfessionalType", "date"]
	const appointmentTitle = ["Patient", "Type", "HealthProfessionalType", "Date"]
	const sessionTitle = ["Patient", "Type", "HealthProfessionalType", "Date"]

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
			url: USERS_COUNT_URL,
			success_cb: (res) => {
				setUserCount(res.body.count)
			}
		})

		FetchManager.fetch({
			url: EXERCISES_COUNT_URL,
			success_cb: (res) => {
				setExerciseCount(res.body.count)
			}
		})
		FetchManager.fetch({
			url: USERS_COUNT_URL,
			success_cb: (res) => {
				setUserCount(res.body.count)
			}
		})
		FetchManager.fetch({
			url: ADMINS_COUNT_URL,
			success_cb: (res) => {
				setAdminCount(res.body.count)
			}
		})

		FetchManager.fetch({
			url: RECENT_APPOINTMENT_URL,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row?.healthProfessionalType?.name ?? "N/a";
					const patient = row?.patient?.name ?? "N/a";
					return {
						...row,
						patient,
						healthProfessionalType,
						date: new Date(row.timestamp).toLocaleDateString(),
						time: new Date(row.timestamp).toLocaleTimeString()
					}
				})
				setAppoinments(rows);
			}
		})
		
		FetchManager.fetch({
			url: RECENT_SESSIONS_URL,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row?.healthProfessionalType?.name ?? "N/a";
					const patient = row?.patient?.name ?? "N/a";
					return {
						...row,
						patient,
						healthProfessionalType,
						date: new Date(row.timestamp).toLocaleDateString(),
						time: new Date(row.timestamp).toLocaleTimeString()
					}
				})
				setSessions(rows);
			}
		})
	}, []);
	return <Layout navList={NavListItems} page={"Dashboard"}>
		<Box component={"main"} className={styles.main} >
			<Box component={"section"} className={styles.TopSection} >
				<Grid container spacing={5}>
					<Grid item xs={6} md={4} lg={3}>
						<DashboardCard link='/appointments' Icon={<CalendarMonthIcon />} number={appointmentCount} text="appointments" />
					</Grid>
					<Grid item xs={6} md={4} lg={3}>
						<DashboardCard link='/sessions' Icon={<PermContactCalendarIcon />} number={sessionCount} text="sessions" />
					</Grid>
					<Grid item xs={6} md={4} lg={3}>
						<DashboardCard link='/users' Icon={<PersonIcon />} number={userCount} text="users" />
					</Grid>
					<Grid item xs={6} md={4} lg={3}>
						<DashboardCard link='/admins' Icon={<PersonIcon />} number={adminCount} text="admins" />
					</Grid>
					<Grid item xs={6} md={4} lg={3}>
						<DashboardCard link='/exercises' Icon={<FitnessCenterIcon />} number={exerciseCount} text="exercises" />
					</Grid>
					<Grid item xs={6} md={4} lg={3}>
						<DashboardCard link='/subscriptions' Icon={<PaymentIcon />} number={"N/A"} text="subscriptions" />
					</Grid>
				</Grid>
			</Box>
			<Box component={"section"} sx={{ marginTop: 2 }}>
				<Grid container spacing={5}>
					<Grid item xs={12} md={6} lg={6}>
						<SimpleTable itemIndex={appointmentIndex} titles={appointmentTitle} rows={appointments} />
					</Grid>
					<Grid item xs={12} md={6} lg={6}>
						<SimpleTable itemIndex={sessionIndex} titles={sessionTitle} rows={sessions} />
					</Grid>
				</Grid>
			</Box>
		</Box>
	</Layout>
}

export default Dashboard;
