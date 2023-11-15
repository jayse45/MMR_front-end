import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import FetchManager from '../../utils/FetchManager';
import { UrlHelper } from '../../utils/UrlHelper';
import Button from '../Button';
import LoadingCircle from '../LoadingCircle';
import SubscriptionPackage from '../SubscriptionPackage/SubscriptionPackage';

const SUBSCRIPTION_URL = UrlHelper.createApiUrlPath("/api/subscriptionPackages/");

const AvailableSubscriptions = ({ cb }) => {
	const [loading, setLoading] = useState(true);
	const [packages, setPackages] = useState([]);

	useEffect(() => {
		FetchManager.fetch({
			url: `${SUBSCRIPTION_URL}current_offerings`,
			success_cb: (res) => {
				setPackages(res.body);
				setLoading(false);
			}
		})
	}, [])
	return (
		<Box>
			{loading && <LoadingCircle />}
			<Box sx={{ mt: 3, display: 'flex', flexDirection: "row", justifyContent: "space-around" }}>
				{!loading && packages.map((item) => {
					return (<Box key={item._id} sx={{ display: 'flex', flexDirection: "column", justifyContent: "center" }} >
						<SubscriptionPackage key={`${item._id}1`} subscriptionPackage={item} />
						<Box sx={{ marginTop: "5px" }}>
							<Button key={item._id} onClick={() => { cb(item) }}>Select Package</Button>
						</Box>
					</Box>)
				})}
			</Box>
		</Box>
	);
}

export default AvailableSubscriptions;
