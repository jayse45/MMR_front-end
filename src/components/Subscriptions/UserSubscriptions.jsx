import { Box, Card, Chip, Grid, Skeleton, Typography } from '@mui/material';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import { useState, useEffect } from 'react';
import NotificationManager from '../../utils/NotificationManager';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';
const USER_SUBSCRIPTION_URL = UrlHelper.createApiUrlPath("/api/subscriptions/users/latest_subscriptions")
const UserSubscriptions = () => {
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [valid, setValid] = useState(false);
	const [subscription, setSubscription] = useState({
		paymentDate: "",
		description: "",
		dueDate: "",
		price: "",
		paymentRef: "",
		packageTitle: ""
	});

	useEffect(() => {
		FetchManager.fetch({
			url: USER_SUBSCRIPTION_URL,
			success_cb: (res) => {
				setValid(res.valid)
				if (res.valid) {
					const paymentDate = new Date(res.body.startTimestamp).toLocaleDateString();
					const dueDate = new Date(res.body.endTimestamp).toLocaleDateString();

					setSubscription({
						paymentDate,
						dueDate,
						price: `${res.body.payment.currency} ${res.body.payment.amount}` ?? "N/a",
						paymentRef: res.body.payment.paymentRef ?? "N/a",
						packageTitle: res.body.package.title ?? "N/a",
						subscription: res.body.package.description ?? "N/a",
					})
				}
				setLoading(false);
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ type: "warning", message: "Failed to get subscription information.", toastId: 1 })
				setLoading(false);

			}
		})
	}, []);
	return (
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
			<Box sx={{ maxWidth: "700px", minHeight: "400px" }}>
				<Card>
					{loading && <Skeleton variant="rectangular" width={"100%"} height={"100%"}/>}
					{!loading && valid &&
						<Grid container>
							<Grid item sm={12} xs={12}>
								<Box sx={{ background: "#a5bbd1", padding: 5, paddingTop: 3, paddingBottom: 3 }}>
									<Typography variant='h3'>{subscription.packageTitle}</Typography>
								</Box>
							</Grid>
							<Grid item sm={6} xs={12}>
								<Box sx={{ padding: 2, paddingTop: 2, paddingBottom: 4 }}>
									<Box sx={{ display: 'flex', justifyContent: "space-between", marginBottom: "1em" }}>
										<Typography variant='subtitle2'>Price</Typography>
										{!loading ? <Chip label={subscription.price} /> : <Skeleton variant="rounded" width={30} height={"1.5em"} />}
									</Box>
									<Box sx={{ display: 'flex', justifyContent: "space-between" }}>
										<Typography variant='subtitle2'>Payment Date</Typography>
										{!loading ? <Chip label={subscription.paymentDate} /> : <Skeleton variant="rounded" width={30} height={"1.5em"} />}
									</Box>
									<Box mt={2} sx={{ display: 'flex', justifyContent: "space-between" }}>
										<Typography variant='subtitle2'>Payment Reference</Typography>
										{!loading ? <Chip label={subscription.paymentRef} /> : <Skeleton variant="rounded" width={30} height={"1.5em"} />}
									</Box>
								</Box>
							</Grid>
							<Grid item sm={6} xs={12} sx={{ borderLeft: "1px solid #eee" }}>
								<Box sx={{ padding: 2, paddingTop: 2, paddingBottom: 4 }}>
									<Box sx={{ display: 'flex', justifyContent: "space-between", marginBottom: "1em" }}>
										<Typography variant='subtitle2'>Next Payment Date</Typography>
										{!loading ? <Chip label={subscription.dueDate} /> : <Skeleton variant="rounded" width={30} height={"1.5em"} />}
									</Box>
									<Box sx={{ display: 'flex', justifyContent: "space-between" }}>
										<Typography variant='subtitle2'>Payment Method</Typography>
										{!loading ? <Chip label="N/A" /> : <Skeleton variant="rounded" width={30} height={"1.5em"} />}
									</Box>
								</Box>
							</Grid>
						</Grid>}
					{!loading && !valid &&
						<Box p={5}>
							<Typography variant="body1">No Previous subscription found.</Typography>
							<Box sx={{ mt: 4 }}>
								<Button onClick={() => navigate("/pay_subscription")}>Goto Subscription Payment</Button>
							</Box>
						</Box>
					}
				</Card>
			</Box>
		</Box>
	);
}

export default UserSubscriptions;
