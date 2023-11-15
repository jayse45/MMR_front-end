import { Box } from '@mui/material';
import Layout from '../../components/Layout/Layout';
import NavListItems from './components/NavListItems';
import LoadingCircle from '../../components/LoadingCircle';
import DataTable from '../../components/DataTable/DataTable';
import { useState, useEffect } from 'react';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import NotificationManager from '../../utils/NotificationManager';

const SUBSCRIPTION_URL = UrlHelper.createApiUrlPath("/api/subscriptions/");

const SubscriptionPage = () => {
	const [subscriptions, setSubscriptions] = useState([])
	const [loading, setLoading] = useState(true);

	const headCells = [
		{ field: 'name', headerName: 'User', width: 150 },
		{ field: 'email', headerName: 'Email', width: 250 },
		{ field: 'title', headerName: 'Subscription', width: 150 },
		{ field: 'amount', headerName: 'Amount', width: 100 },
		{ field: 'start_date', headerName: 'Start Date', width: 200 },
		{ field: 'end_date', headerName: 'End Date', width: 200 },
		
	];

	useEffect(() => {
		FetchManager.fetch({
			url: SUBSCRIPTION_URL,
			success_cb: (res) => {
				if (res.status === 200) {
					const body = res.body.map(item => {
						return {
							...item,
							name: item?.user?.name ?? "N/a",
							email: item?.user?.email ?? "N/a",
							role: item?.user?.role ?? "N/a",
							title: item?.package?.title ?? "N/a",
							start_date: new Date(item.startTimestamp).toLocaleString(),
							end_date: new Date(item.endTimestamp).toLocaleString(),
							amout: `${item?.payment?.currency ?? "N/a"} ${item?.payment?.amount ?? "N/a"}`
						}
					})
					setSubscriptions(body);
				} else {
					NotificationManager.notifyUser({ message: "Failed to fecth subscriptions", type: "info", toastId: 1 })
				}
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ message: "Network error. Failed to fecth subscriptions", type: "warning", toastId: 1 })
			}
		})
		setLoading(false);

	}, []);

	return (
		<Layout navList={NavListItems}>
			<Box component={"section"} sx={{ marginTop: 2 }}>
				{loading ?
					<LoadingCircle />
					: <DataTable title={"Subscriptions"} columns={headCells} rows={subscriptions} pageSize={10} />
				}
			</Box>
		
		</Layout>
	);
}

export default SubscriptionPage;
