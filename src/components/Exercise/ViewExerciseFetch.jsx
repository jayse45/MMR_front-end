import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'
import { useEffect, useState } from 'react';
import FetchManager from '../../utils/FetchManager';
import { UrlHelper } from '../../utils/UrlHelper';
import NotificationManager from '../../utils/NotificationManager';
import { styled } from '@mui/material/styles';
import { Modal, Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Typography } from '@mui/material';
import {
	OndemandVideo as OndemandVideoIcon,
	Panorama as PanoramaIcon,
	SpatialAudioOff as SpatialAudioOffIcon,
	ExpandMore as ExpandMoreIcon,
	Close as CloseIcon,
} from '@mui/icons-material';
import VideoPlayer from '../VideoPlayer';
import AudioPlayer from '../AudioPlayer';
import { Box } from '@mui/system';
const EXERCISES_URL = UrlHelper.createApiUrlPath("/api/exercises/");

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

const ExpandMore = styled((props) => {
	const { expand, ...other } = props;
	return <IconButton {...other} />;
})(({ theme, expand }) => ({
	transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
	marginLeft: 'auto',
	transition: theme.transitions.create('transform', {
		duration: theme.transitions.duration.shortest,
	}),
}));

const ViewExerciseFetch = ({ exerciseId }) => {
	const [exercise, setExercise] = useState({});
	const [expanded, setExpanded] = useState(false);
	const [modalContent, setModalContent] = useState("image");
	const [openModal, setOpenModal] = useState(false);

	const handleExpandClick = () => {
		setExpanded(!expanded);
	};

	const openModel = (content) => {
		setModalContent(content);
		setOpenModal(true);
	}
	const handleClose = () => {
		setOpenModal(false);
	}

	useEffect(() => {
		FetchManager.fetch({
			url: EXERCISES_URL + exerciseId,
			success_cb: (res) => {
				setExercise(res.body);
				new MuiPlayer({
					container: '#mui-player',
					title: res.body.title,
					src: res.body.video,
					lang: "en"
				})
			},
			failure_cb: () => {
				NotificationManager.notifyUser({
					message: "Failed to fetch exercise",
					type: "warning",
					toastId: "exercise"
				})
			}
		})

	}, [exerciseId]);

	return (
		<>
			<Card sx={{ maxWidth: 345 }}>
				<CardHeader
					title={<Typography variant="subtitle1">{exercise.title}</Typography>}
				/>
				<CardMedia
					component="img"
					height="120"
					image={exercise.thumbImage.url}
					alt="thumbImage"
				/>
				<CardActions disableSpacing>
					<IconButton aria-label="view image description" onClick={() => openModel("image")}>
						<PanoramaIcon color="primary" />
					</IconButton>
					<IconButton title="play commentary" aria-label="listen to commentary" onClick={() => openModel("audio")}>
						<SpatialAudioOffIcon color="primary" />
					</IconButton>
					<IconButton title="play video" aria-label="play video" onClick={() => openModel("video")}>
						<OndemandVideoIcon color="primary" />
					</IconButton>
					<ExpandMore
						expand={expanded}
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label="show description"
					>
						<ExpandMoreIcon />
					</ExpandMore>
				</CardActions>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<CardContent>
						<Typography variant='subtitle2'>{exercise.description}</Typography>
					</CardContent>
				</Collapse>
			</Card>
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
						{modalContent === "audio" &&
							<Box>
								<Typography variant='subtitle1'>Play Audio Commentary only</Typography>
								<AudioPlayer src={exercise.audio.url} />
							</Box>
						}
						{modalContent === "image" && <Box component="img" sx={{ width: "100%", objectFit: "scale-down" }} src={exercise.image.url} alt="Image Description" />}
						{modalContent === "video" &&
							<Box>
								<Typography variant='subtitle1'>Video Demostration</Typography>
								<VideoPlayer src={exercise.video.url} title={exercise.title} />
							</Box>
						}
					</Box>
				</Box>
			</Modal>
		</>
	);
}

export default ViewExerciseFetch;
