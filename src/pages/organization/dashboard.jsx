import { Grid, Typography, Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import Layout from '../../components/Layout/Layout';
import SimpleTable from '../../components/SimpleTable/SimpleTable';
import NavListItems from './components/NavListItems';
import { UrlHelper } from '../../utils/UrlHelper';
import {
	Person as PersonIcon,
} from '@mui/icons-material';
import FetchManager from '../../utils/FetchManager';

const USERS_COUNT_URL = UrlHelper.createApiUrlPath("/api/users/users/count");
const RECENT_USERS_URL = UrlHelper.createApiUrlPath("/api/users/users/paginate?limit=10&page=0");

const Dashboard = () => {
	const [users, setUsers] = useState([])
	const [usersCount, setUsersCount] = useState("");
	const usersIndex = ["name", "email", "createdAt"];
	const usersTitle = ["Name", "Email", "createdAt"];
	useEffect(() => {
		FetchManager.fetch({
			url: USERS_COUNT_URL,
			success_cb: (res) => {
				setUsersCount(res.body.count);
			}
		})
		FetchManager.fetch({
			url: RECENT_USERS_URL,
			success_cb: (res) => {
				setUsers(res.body);
			}
		})
	}, []);
	return <Layout navList={NavListItems} page={"Dashboard"}>
		<Box component={"main"}>
			<Box component={"section"}>
				<Grid container spacing={5}>
					<Grid item xs={6} md={4} lg={4}>
						<DashboardCard link='/users' Icon={<PersonIcon />} number={usersCount} text="users" />
					</Grid>
				</Grid>
			</Box>
			<Box component={"section"} sx={{ marginTop: 2 }}>
				<Grid container spacing={5}>
					<Grid item xs={12} md={6} lg={6}>
						<SimpleTable itemIndex={usersIndex} titles={usersTitle} rows={users} />
					</Grid>
					<Grid item xs={12} md={6} lg={6}>
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
