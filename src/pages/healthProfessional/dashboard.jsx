import { Grid, Typography, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Layout from '../../components/Layout/Layout';
import SimpleTable from '../../components/SimpleTable/SimpleTable';
import NavListItems from './components/NavListItems';
import { UrlHelper } from '../../utils/UrlHelper';
import { PermContactCalendar as PermContactCalendarIcon } from '@mui/icons-material';
import FetchManager from '../../utils/FetchManager';

const RECENT_SESSION_URL = UrlHelper.createApiUrlPath("/api/sessions/users/paginate?limit=10&page=0");
const SESSION_COUNT_URL = UrlHelper.createApiUrlPath("/api/sessions/users/count");

const DashboardPage = () => {
	const [sessions, setSessions] = useState([])
	const [sessionCount, setSessionCount] = useState("");
	const sessionIndex = ["type", "healthProfessionalType", "date", "time"]
	const sessionTitle = ["Type", "HealthProfessionalType", "Date", "Time"]

	useEffect(() => {
		FetchManager.fetch({
			url: SESSION_COUNT_URL,
			success_cb: (res) => {
				setSessionCount(res.body.count)
			}
		})
		FetchManager.fetch({
			url: RECENT_SESSION_URL,
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
				setSessions(rows);
			}
		})
	}, []);
	return <Layout navList={NavListItems} page={"Dashboard"}>
		<Box component={"main"} >
			<Box component={"section"} >
				<Grid container spacing={5}>
					<Grid item xs={7} md={4} lg={3}>
						<DashboardCard link='/sessions' Icon={<PermContactCalendarIcon />} number={sessionCount} text="sessions" />
					</Grid>
				</Grid>
			</Box>
			<Box component={"section"} sx={{ marginTop: 2 }}>
				<Grid container spacing={5}>
					<Grid item xs={10} md={8} lg={6}>
						<SimpleTable itemIndex={sessionIndex} titles={sessionTitle} rows={sessions} />
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

export default DashboardPage;
