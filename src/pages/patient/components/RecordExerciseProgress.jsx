import { useState, useEffect } from 'react';
import { Modal, Card, Checkbox, CardHeader, CardMedia, CardActions, IconButton, Typography, Divider, TextField } from '@mui/material';
import {
	OndemandVideo as OndemandVideoIcon,
	Panorama as PanoramaIcon,
	Article as ArticleIcon,
	SpatialAudioOff as SpatialAudioOffIcon,
	Close as CloseIcon,
} from '@mui/icons-material';
import { Box } from '@mui/system';
import FetchManager from '../../../utils/FetchManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import NotificationManager from '../../../utils/NotificationManager';
import Button from '../../../components/Button';

const style = {
	Modal: {
		position: "absolute",
		top: "50%",
		left: "70%",
		transform: "translate(-50%, -50%)",
		minWidth: "400px",
		width: "70%",
		maxHeight: "90vh",
		minHeight: "200px",
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
		background: "#0474E8",
		position: "absolute",
		right: "0px",
		top: "0px",
		justifyContent: "flex-end",
	}
};
const SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/users/");

const RecordExerciseProgress = ({ exercise, prescription, sessionId }) => {
	const [modalContent, setModalContent] = useState("image");
	const [openModal, setOpenModal] = useState(false);
	const [prescriptionState, setPrescriptionState] = useState(prescription);
	const openModel = (content) => {
		setModalContent(content);
		setOpenModal(true);
	}
	const handleClose = () => {
		setOpenModal(false);
	}

	const handleChange = (evt) => {
		setPrescriptionState({
			...prescriptionState,
			patientComment: evt.target.value
		})
	} 
	const markAsCompleted = () => {
		FetchManager.fetch({
			url: `${SESSIONS_URL}${sessionId}/exercises/${prescriptionState._id}`,
			method: "PUT",
			body: { status: "completed", patientComment: prescriptionState.patientComment ?? " " },
			success_cb: (res) => {
				setPrescriptionState(res.body);
				NotificationManager.notifyUser({
					message: "Updated",
					type: "success"
				})
			}
		})
		handleClose()
	}
	const markAsNotCompleted = () => {
		FetchManager.fetch({
			url: `${SESSIONS_URL}${sessionId}/exercises/${prescriptionState._id}`,
			method: "PUT",
			body: { status: "viewed", patientComment: prescriptionState.patientComment ?? " " },
			success_cb: (res) => {
				setPrescriptionState(res.body);
				NotificationManager.notifyUser({
					message: "Updated",
					type: "success"
				})
			}
		})
		handleClose()
	}
	useEffect(() => {
		if (prescription.status === "added") {
			FetchManager.fetch({
				url: `${SESSIONS_URL}${sessionId}/exercises/${prescriptionState._id}`,
				method: "PUT",
				body: { status: "viewed", patientComment: "" },
				success_cb: (res) => {
					setPrescriptionState(res.body)
				}
			})
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Card sx={{ maxWidth: 345 }}>
				<CardHeader
					title={<Typography sx={
						{
							height: "1.2em", textOverflow: "ellipsis",
							overflow: "hidden", whiteSpace: "nowrap",
							maxWidth: "200px"
						}
					} variant="subtitle1" title={exercise.title}>{exercise.title}</Typography>}
				/>
				<CardMedia
					sx={{ borderTop: "1px solid grey" }}
					component="img"
					height="120"
					image={exercise.thumbImage?.url ?? "/static/img/placeholder-img.jpg"}
					alt="thumbImage"
				/>
				<CardActions disableSpacing display={"flex"} sx={{ justifyContent: "space-between" }}>
					<Box>
						<IconButton aria-label="view description of exercise" onClick={() => openModel("description")}>
							<ArticleIcon color="primary" />
						</IconButton>
						<IconButton aria-label="view image description" onClick={() => openModel("image")}>
							<PanoramaIcon color="primary" />
						</IconButton>
						<IconButton title="play exercise commentary" aria-label="listen to commentary" onClick={() => openModel("audio")}>
							<SpatialAudioOffIcon color="primary" />
						</IconButton>
						<IconButton title="play video" aria-label="play video" onClick={() => openModel("video")}>
							<OndemandVideoIcon color="primary" />
						</IconButton>
					</Box>
					<Box sx={{ backgroundColor: "#1976d214"}}>
						<Checkbox onChange={() => openModel("comment")} title="Mark as completed" inputProps={{ 'aria-label': 'controlled' }} checked={prescriptionState.status === "completed"} />
					</Box>
				</CardActions>
			</Card>
			<Modal
				open={openModal}
				onClose={handleClose}
				sx={{ maxWidth: "70%", minHeight: "200px" }}
			>
				<Box sx={style.Modal}>
					<Box sx={style.CloseButton}>
						<IconButton onClick={handleClose}>
							<CloseIcon />
						</IconButton>
					</Box>
					<Box sx={style.ContentWrapper}>
						{modalContent === "audio" &&
							<Box display={"flex"} sx={{ alignItems: "center", justifyContent: "center", alignContent: "center", flexDirection: "column" }}>
								<Typography mb={3} variant='body2'>Audio Commentary</Typography>
								<Box sx={{ width: "400px" }} component="audio" controls src={exercise.audio?.url ?? ""} />
							</Box>
						}
						{modalContent === "image" &&
							<Box component="img" sx={{ width: "100%", objectFit: "scale-down" }}
								src={exercise.image?.url ?? "/static/img/placeholder-img.jpg"}
								alt="Image Description" />
						}
						{modalContent === "description" &&
							<Box>
								<Typography variant='subtitle2' mb={1} >Exercise Description</Typography>
								<Divider />
								<Typography variant='body2'>{exercise.description}</Typography>
							</Box>
						}
						{modalContent === "video" &&
							<Box>
								<Box mt={2} component={"video"} controls sx={{ width: "100%", maxHeight: "500px", objectFit: "scale-down" }} src={exercise.video.url} />
								<Typography mt={2} variant="subtitle2">Video: {exercise.title}</Typography>
							</Box>
						}
						{modalContent === "comment" &&
							<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
								<Box sx={{ marginTop: 2, marginBottom: 3 }}>
									<TextField mb={2} rows={2} fullWidth label="Comment" multiline name="patientComment" onChange={handleChange} value={prescriptionState.patientComment ?? " "} />
								</Box>
				
								<Box sx={{ display: "flex", alignItems:"baseline", justifyContent: "space-around", paddingRight: 4 }} >
									<Typography mt={2} variant="h6" textAlign={"center"}>Have you completed this exercise? </Typography>
									<Button variant={"outlined"} onClick={markAsNotCompleted}>No</Button>
									<Button onClick={markAsCompleted}>Yes</Button>
								</Box>
							</Box>
						}
					</Box>
				</Box>
			</Modal>
		</>
	);
}

export default RecordExerciseProgress;
