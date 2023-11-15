import { Paper, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Button from './Button'
import { UrlHelper } from '../utils/UrlHelper';
import FetchManager from '../utils/FetchManager';
import LoadingCircle from './LoadingCircle';
import { Cancel, Check } from '@mui/icons-material';
import { useParams } from "react-router-dom";

const USERS_URL = UrlHelper.createApiUrlPath("/api/users/")

export default function VerifyEmailPage({ email }) {
	const [verified, setVerified] = useState(false);
	const [loading, setLoading] = useState(true);
	const { token } = useParams();

	useEffect(() => {
		FetchManager.fetch({
			url: `${USERS_URL}verifyEmail`,
			method: "PUT",
			body: {
				token
			},
			success_cb: (res) => {
				if (res.status === 200) {
					setVerified(true);
				}
				setLoading(false);
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
			<Paper sx={{ p: 5, marginY: 5, maxWidth: "600px", minWidth: "500px" }}>
				<Typography mb={2} variant="h5" textAlign={"center"}>Email Verification</Typography>
				<>
					{loading ?
						<LoadingCircle />
						:
						<Box sx={{ display: "flex", justifyContent: "center" }}>
							{verified ?
								<Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }} >
									<Box sx={{ marginBottom: "1em" }}>
										<Check sx={{ width: "150px", height: "150px", color: "#fff", backgroundColor: "#0b6400", borderRadius: "50%", }} />
									</Box>
									<Typography sx={{ display: "block" }} variant="caption">
										Thank you for verifying your email. You can login to the application with the link below.
									</Typography>
									<Button href="/login">Login</Button>
								</Box>
								:
								<Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
									<Box sx={{ marginBottom: "1em" }}>
										<Cancel sx={{ width: "150px", height: "150px", color: "#fff", backgroundColor: "#990015", borderRadius: "50%", }} />
									</Box>
									<Typography mb={3} sx={{ display: "block", marginBotton: "2em" }} variant="body2">
										Email verification failed. This is probably because this you have already verified your account.
										If this is not the case contact the support at <b>info@monitormyrehab.com</b>.
									</Typography>
									<Button mt={1} href="mailto:info@monitormyrehab.com">Contact Support</Button>
								</Box>
							}
						</Box>
					}
				</>
			</Paper>
		</Box>
	)
}
