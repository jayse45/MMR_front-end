import { useState } from 'react';
import { Modal, Card, CardHeader, CardMedia, CardActions, IconButton, Typography, Divider, Menu, MenuItem } from '@mui/material';
import {
	OndemandVideo as OndemandVideoIcon,
	Panorama as PanoramaIcon,
	Article as ArticleIcon,
	SpatialAudioOff as SpatialAudioOffIcon,
	MoreVert as MoreVertIcon,
	Close as CloseIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
} from '@mui/icons-material';
import { Box } from '@mui/system';

const style = {
	Modal: {
		position: "absolute",
		top: "50%",
		left: "70%",
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

const ViewExerciseCard = ({ exercise, editAction, deleteAction, modify }) => {
	const [modalContent, setModalContent] = useState("image");
	const [openModal, setOpenModal] = useState(false);
	const [openMenu, setOpenMenu] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	const openModel = (content) => {
		setModalContent(content);
		setOpenModal(true);
	}
	const handleClose = () => {
		setOpenModal(false);
	}

	const openModifyMenu = (evt) => {
		setAnchorEl(evt.currentTarget);
		setOpenMenu(true);
	}
	const closeModifyMenu = (evt) => {
		setAnchorEl(null);
		setOpenMenu(false)
	}
	const editExercise = () => {
		closeModifyMenu()
		editAction()
	}
	const deleteExercise = () => {
		closeModifyMenu()
		deleteAction()
	}

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
					{modify &&
						<Box>
							<IconButton title="open modify menu" onClick={openModifyMenu}>
								<MoreVertIcon color="primary" />
							</IconButton>
						</Box>
					}
				</CardActions>

				<Menu
					id="positioned-menu"
					aria-labelledby="positioned-button"
					open={openMenu}
					anchorEl={anchorEl}
					onClose={closeModifyMenu}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
				>
					<MenuItem onClick={editExercise} sx={{ color: "#1c480a" }}><EditIcon /> Edit</MenuItem>
					<MenuItem onClick={deleteExercise} sx={{ color: "#a31818" }}><DeleteIcon /> Delete</MenuItem>
				</Menu>
			</Card>
			<Modal
				open={openModal}
				onClose={handleClose}
				sx={{ maxWidth: "70%", minHeight: "300px" }}
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
					</Box>
				</Box>
			</Modal>
		</>
	);
}

export default ViewExerciseCard;
