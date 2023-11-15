import { Paper, Box, Typography } from '@mui/material'
import React from 'react'
import Button from './Button'

export default function VerifyEmailBlock({ email }) {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
			<Paper sx={{ p: 5, marginY: 5, maxWidth: "600px" }}>
				<Typography mb={2} variant="h5" textAlign={"center"}>Verify your email</Typography>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Typography ml={2} variant="body1">You will need to verify your email to complete the registration</Typography>
				</Box>
				<Box sx={{ width: "200px" }} component="img" src="/static/img/mailbox.svg" />
				<Typography mb={3} sx={{ display: "block" }} variant="caption">
					An email has been sent to <b>{email}</b> with a link to verify your account.
					If you do not receive this email after a few minutes, please check your promotions, update or spam folder
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "space-around" }}>
					<Button href="/logout" variant='outlined'>Logout</Button>
					<Button href="mailto:info@monitormyrehab.com">Contact Support</Button>
				</Box>
			</Paper>
		</Box>
	)
}
