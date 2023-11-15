import { Box, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import Button from '../Button';
import FetchManager from '../../utils/FetchManager';
import { UrlHelper } from '../../utils/UrlHelper';
import { Check } from '@mui/icons-material';

export default function ResetPasswordRequest({ userType = "user" }) {
	const [email, setEmail] = useState("");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);
	const [completed, setCompleted] = useState(false);
	const handleEmailChange = (evt) => {
		setEmail(evt.target.value)
	}
	const submitRequest = (evt) => {
		evt.preventDefault();
		let RESET_URL;
		if (userType === "user") {
			RESET_URL = UrlHelper.createApiUrlPath("api/users/resetPasswordRequest");
		} else if (userType === "admin") {
			RESET_URL = UrlHelper.createApiUrlPath("api/admins/resetPasswordRequest");;
		}

		FetchManager.fetch({
			url: RESET_URL, method: "PUT", body: { email },
			success_cb: (res) => {
				setResponse(res.message);
				setLoading(false);
				setCompleted(true)
			},
			prefetch_cb: () => {
				setLoading(true);
			}
		})

	}
	return (
		<Box mt={10} >
			{completed ?
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
					<Check sx={{ width: "150px", height: "150px", color: "#fff", backgroundColor: "#0b6400", borderRadius: "50%" }} />
					<Typography variant='subtitle2'>{response}</Typography>
				</Box>
				:
				<Box component="form" method="POST" onSubmit={submitRequest} sx={{ minWidth: "300px", display: "flex", flexDirection: "column", alignItems: "center" }} >
					<Typography variant='subtitle2' textAlign='center'>Reset Password</Typography>
					<TextField size='medium' disabled={loading} variant="outlined" margin="normal" required fullWidth
						type="email" className='textInput' id="email" placeholder='happy@email.com' label="Email Address"
						name="email" value={email} onChange={handleEmailChange} autoComplete="email"
					/>
					<Button type="submit" loading={loading} onClick={submitRequest}>Request Password Reset</Button>
				</Box>
			}
		</Box>
	)
}
