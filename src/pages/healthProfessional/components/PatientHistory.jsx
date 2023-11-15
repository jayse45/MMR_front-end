import { Fragment, useState, useEffect } from 'react';
import { Box, IconButton, List, ListItem, ListItemButton, ListItemText, Modal, Skeleton, Typography } from '@mui/material';
import FetchManager from '../../../utils/FetchManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import NotificationManager from '../../../utils/NotificationManager';
import SessionDetails from './SessionDetails';
import {
	Close as CloseIcon,
} from '@mui/icons-material';
const style = {
	Modal: {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		minWidth: "400px",
		width: "70%",
		maxHeight: "90vh",
		minHeight: "50vh",
		backgroundColor: "#ffffff",
		border: "1px solid #131813",
		borderRadius: "0.5em",
		boxShadow: "10px 5px 10px #a7a5a5",
		padding: "2rem 0rem 0.6em 1rem"
	},
	ContentWrapper: {
		maxHeight: "80vh",
		overflowY: "auto",
		padding: "0em 2rem 2rem 1em",
		marginRight: "1px",
	},
	CloseButton: {
		display: "flex",
		background: "#0b6400",
		position: "absolute",
		right: "0px",
		top: "0px",
		justifyContent: "flex-end",
	}
};

const USER_SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/user_sessions/")
const PatientHistory = ({ userId }) => {
	const [sessions, setSessions] = useState([]);
	const [modalSession, setModalSession] = useState();
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(true);

	const handleOpenModal = (session) => {
		setModalSession(session);
		setOpenModal(true);
	}
	const handleClose = () => {
		setOpenModal(false);
	}
	useEffect(() => {
		FetchManager.fetch({
			url: USER_SESSIONS_URL + userId,
			success_cb: (res) => {
				if (res.status) {
					const rows = res.body.map(row => {
						const healthProfessionalType = row.healthProfessionalType.name;
						const healthProfessional = row.healthProfessional.name;
						return {
							...row, healthProfessionalType, healthProfessional,
							date: new Date(row.timestamp).toLocaleDateString(),
							time: new Date(row.timestamp).toLocaleTimeString()
						}
					})
					setSessions(rows);
				} else {
					NotificationManager.notifyUser({
						message: "failed to fetch user history",
						type: "warning",
					})
				}
				setLoading(false);
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({
					message: "Error occurred while fetching user history. Try again later",
					type: "error",
					toastId: "error"
				})
			}

		})
	}, [userId]);
	return (
		<Box>
			<List>
				{loading ?
					<>
						<Skeleton variant="rectagular" animation="wave" width={"100%"} height={"100px"} />
					</>
					:
					<>
						{sessions.length === 0 ?
							<ListItem><Typography variant='caption'>No previous sessions</Typography></ListItem>
							:
							sessions.map(session => (
								<ListItemButton onClick={() => handleOpenModal(session)} key={session._id} sx={{ borderBottom: "1px solid #eee", borderTop: "1px solid #eee" }}>
									<ListItemText primary={session.healthProfessional.toLocaleUpperCase()} secondary={
										<Fragment>
											<Typography
												sx={{ display: 'inline' }}
												component="span"
												variant="body2"
												color="text.primary"
											>
												{session.date} - {session.time} {" "}
											</Typography>
											- {session.healthProfessionalType.toLocaleUpperCase()}
										</Fragment>
									} />
								</ListItemButton>
							))}

					</>
				}
			</List>
			<Modal
				open={openModal}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style.Modal}>
					<Box sx={style.CloseButton}>
						<IconButton onClick={handleClose}>
							<CloseIcon />
						</IconButton>
					</Box>
					<Box sx={style.ContentWrapper}>
						<SessionDetails session={modalSession} />
					</Box>
				</Box>
			</Modal>
		</Box>
	);
}

export default PatientHistory;
