import { useEffect, useState } from 'react';
import FetchManager from '../../utils/FetchManager';
import { Box } from '@mui/system';
import LoadingCircle from '../LoadingCircle';
import { UrlHelper } from '../../utils/UrlHelper';

const SETTINGS_URL = UrlHelper.createApiUrlPath("/api/payments/");

const PaystackProvider = ({ selectedPackage }) => {
	const [paystackPaymentUrl, setPaystackPaymentUrl] = useState("");
	const [loading, setloading] = useState(true);

	useEffect(() => {
		FetchManager.fetch({
			url: `${SETTINGS_URL}generate_payment_url`,
			method: "POST",
			body: {
				subscriptionPackageId: selectedPackage._id
			},
			success_cb: (res) => {
				setPaystackPaymentUrl(res.body.authorization_url)
				setloading(false)
			}
		})
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Box sx={{display: "flex", justifyContent: "center"}}>
			{loading && <LoadingCircle />}
			{!loading && <embed style={{ "min-width": "540px", minHeight: "80vh"}} src={paystackPaymentUrl} />}
		</Box>
	);
}

export default PaystackProvider;
