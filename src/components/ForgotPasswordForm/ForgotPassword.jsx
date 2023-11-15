import { useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { TextField, Button, CircularProgress, Grid, Box, Typography } from '@mui/material';
import { Link } from "react-router-dom";
import NotificationManager from '../../utils/NotificationManager';
import "./ForgotPassword.scss";
const env = process.env;

export default function ForgotPassword() {
	const PASSWORD_REST_URL = `${env.REACT_APP_API_URL}api/users/password_reset_email`
	const [email, setEmail] = useState("");
	const [formNotSubmitted, setFormNotSubmitted] = useState(true);
	const [loadingFormSubmission, setLoadingFormSubmission] = useState(true);

	const handleEmailChange = (evt) => {
		setEmail(evt.target.value)
	}

	const submitForm = () => {
		setFormNotSubmitted(false);
		fetch(PASSWORD_REST_URL, {
			method: "POST",
			body: JSON.stringify({ email }),
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
			}

		})
			.then(response => response.json())
			.then((res) => {
				if (res.status) {
					setLoadingFormSubmission(false);
				} else {
					setLoadingFormSubmission(true);
					setFormNotSubmitted(true);
					NotificationManager.notifyUser({
						message: res.message,
						type: "info",
						duration: 3000,
					});
				}
			})
			.catch((err) => {
				console.log(err);
				NotificationManager.notifyUser({
					message: 'Password reset failed. Please check your internet connection and try again later.',
					type: "error",
					duration: 3000,
				});

			});
	}
	return (
		<Box>
			<Typography className='formTitle' component="span" variant="subtitle2" mt={3}>
				Recovery Password
			</Typography>
			<Box className='form'>
				{formNotSubmitted ?
					<Box sx="formInputWrapper">
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							value={email}
							onChange={handleEmailChange}
							id="email"
							type="email"
							label="Email Address"
							name="email"
							autoComplete="email"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							onClick={submitForm}
							className='submit'
						>
							Reset Password
						</Button>
						<Grid container>
							<Grid item>
								<Link to="/" variant="body2">
									{"Remember password? Sign In"}
								</Link>
							</Grid>
						</Grid>

					</Box>
					:
					loadingFormSubmission ?
						<div className='cardBody' >
							<div className="flexJustifyCenter">
								<CircularProgress className='submit' />
							</div>
							<div className="flexJustifyAround">
								<Typography component={"p"}>
									Sending reset link to your email address
								</Typography>
							</div>
						</div>
						:
						<div className='cardBody' >
							<div className="flexJustifyCenter">
								<CheckCircleOutlineIcon className='largeCheckIcon'/>
							</div>
							<Typography component={"p"} className="flexJustifyCenter">
								Reset Email sent successfully.
							</Typography>
							<Typography component={"p"} className="flexJustifyCenter">
								Check your inbox for a password reset link.
							</Typography>
						</div>
				}
			</Box>
		</Box>
	);
}