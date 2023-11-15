import { Fragment, useEffect, useState } from 'react';
import { TextField, FormControl, Box, Typography, FormLabel, Step, StepLabel, Stepper, MenuItem } from '@mui/material';
import FetchManager from '../../utils/FetchManager';
import NotificationManager from '../../utils/NotificationManager';
import { UrlHelper } from '../../utils/UrlHelper';
import Button from '../Button';
import styles from "./AddExerciseForm.scss";

const EXERCISES_URL = UrlHelper.createApiUrlPath("/api/exercises/");
const PRESIGNED_URL = UrlHelper.createApiUrlPath("/api/storage/presignedUrl");
const BODY_PARTS_URL = UrlHelper.createApiUrlPath("/api/bodyParts");

const EditExerciseForm = ({ success_cb, exercise }) => {
	const [step, setStep] = useState(0);
	const [currentExercise, setCurrentExecise] = useState(exercise);
	const [bodyParts, setBodyParts] = useState([]);
	const [formData, setFormData] = useState({
		title: exercise.title,
		description: exercise.description,
		bodyPart: exercise.bodyPart._id,
		thumbImage: null,
		image: null,
		audio: null,
		video: null,
	});
	const [placeholders, setPlaceholders] = useState({
		thumbImage: currentExercise?.thumbImage?.url ?? '/static/img/placeholder-img.jpg',
		image: currentExercise?.image?.url ?? '/static/img/placeholder-img.jpg',
		video: currentExercise?.video?.url ?? "",
		audio: currentExercise?.audio?.url ?? "",
	})
	const [isLoading, setIsLoading] = useState(false);

	const handleFormChange = (evt) => {
		const name = evt.target.name;
		setFormData({
			...formData,
			[name]: evt.target.value
		})
	}

	const handleFileSelect = (evt) => {
		const name = evt.target.name;
		setFormData({
			...formData,
			[name]: evt.target.files[0]
		})
		setPlaceholders({
			...placeholders,
			[name]: URL.createObjectURL(evt.target.files[0])
		})
	}

	const handleTextSubmission = async (evt) => {
		evt.preventDefault();
		setIsLoading(true);
		if (formData.title === "" || formData.description === "" || formData.bodyPart === "") {
			setIsLoading(false);
			NotificationManager.notifyUser({ type: "info", message: "All fields are required", toastId: 1 })
			return false;
		}

		const body = {
			"title": formData.title,
			"description": formData.description,
			"bodyPart": formData.bodyPart
		}

		const res = await FetchManager.asycnFetch({
			method: "PUT",
			url: EXERCISES_URL + currentExercise._id,
			body,
			failure_cb: (res) => {
				setIsLoading(false);
				if (res.status === "validation") {
					NotificationManager.notifyUser({ type: "warning", message: res.data[0].msg })
				} else {
					NotificationManager.notifyUser({ type: "warning", message: res.message })
				}
			}
		})

		if (res.status === 200) {
			NotificationManager.notifyUser({ type: "success", message: "Saved." })
			setCurrentExecise(res.body);
			return true
		} else {
			NotificationManager.notifyUser({ type: "warning", message: "Failed to save." })
			return false
		}

	}

	const handleImagesSubmission = async (evt) => {
		if (formData.thumbImage === null|| formData.image === null) {
			setIsLoading(false);
			NotificationManager.notifyUser({ type: "info", message: "Thumb Image and Image are required", toastId: 1 })
			return false;
		}

		const thumbPresignedUrl = await FetchManager.asycnFetchJSON({
			url: PRESIGNED_URL, method: "POST", body: {
				fileType: formData.thumbImage.type,
				key: currentExercise.thumbImage.key
			}
		})
		const thumbResponse = await fetch(thumbPresignedUrl.body, {
			method: "PUT",
			headers: {
				'content-type': formData.thumbImage.type,
				'content-length': formData.thumbImage.size,
			},
			body: formData.thumbImage
		})

		if (thumbResponse.statusText !== "OK") {
			NotificationManager.notifyUser({ type: "error", message: "Sorry, could not upload thumbImage", toastId: 1 })
			return false;
		}

		const imagePresignedUrl = await FetchManager.asycnFetchJSON({
			url: PRESIGNED_URL, method: "POST", body: {
				fileType: formData.image.type,
				key: currentExercise.image.key
			}
		})
		const imageResponse = await fetch(imagePresignedUrl.body, {
			method: "PUT",
			headers: {
				'content-type': formData.image.type,
				'content-length': formData.image.size,
			},
			body: formData.image
		}) 
		
		if (imageResponse.statusText !== "OK") {
			NotificationManager.notifyUser({ type: "error", message: "Sorry, could not upload image description", toastId: 1 })
			return false;
		}

		NotificationManager.notifyUser({ type: "success", message: "Images Uploaded", toastId: 1 })
		return true;
	}

	const handleAudioSubmission = async (evt) => {
		if (formData.audio === "" || formData.audio === null) {
			setIsLoading(false);
			NotificationManager.notifyUser({ type: "info", message: "Audio is required", toastId: 1 })
			return false;
		}
		const audioPresignedUrl = await FetchManager.asycnFetchJSON({
			url: PRESIGNED_URL, method: "POST", body: {
				fileType: formData.audio.type,
				key: currentExercise.audio.key
			}
		})
		const audioResponse = await fetch(audioPresignedUrl.body, {
			method: "PUT",
			headers: {
				'content-type': formData.audio.type,
				'content-length': formData.audio.size,
			},
			body: formData.audio
		})
		if (audioResponse.statusText !== "OK") {
			NotificationManager.notifyUser({ type: "error", message: "Sorry, could not upload audio", toastId: 1 })
		}

		NotificationManager.notifyUser({ type: "success", message: "Audio Uploaded", toastId: 1 })
		return true;
	}
	const handleVideoSubmission = async (evt) => {
		if (formData.video === "" || formData.video === null) {
			setIsLoading(false);
			NotificationManager.notifyUser({ type: "info", message: "Video is required", toastId: 1 })
			return false;
		}
		const videoPresignedUrl = await FetchManager.asycnFetchJSON({
			url: PRESIGNED_URL, method: "POST", body: {
				fileType: formData.video.type,
				key: exercise.video.key
			}
		})
		const videoResponse = await fetch(videoPresignedUrl.body, {
			method: "PUT",
			headers: {
				'content-type': formData.video.type,
				'content-length': formData.video.size,
			},
			body: formData.video
		})
		if (videoResponse.statusText !== "OK") {
			NotificationManager.notifyUser({ type: "error", message: "Sorry, could not upload video", toastId: 1 })
			return false;
		}
		NotificationManager.notifyUser({ type: "success", message: "Video Uploaded", toastId: 1 })
		return true;
	}
	const nextStepHandler = async (evt) => {
		if (step < 3) {
			setStep(step + 1);
		} else {
			success_cb();
		}
	}

	const previousStepHandler = async (evt) => {
		if (step > 0) {
			setStep(step - 1);
		}
	}

	const nextSaveHandler = async (evt) => {
		setIsLoading(true);
		if (step === 0) {
			if (!await handleTextSubmission(evt)) {
				return false;
			}
		} else if (step === 1) {
			if (!await handleImagesSubmission(evt)) {
				return false;
			}
		} else if (step === 2) {
			if (!await handleAudioSubmission(evt)) {
				return false;
			}
		} else if (step === 3) {
			if (!await handleVideoSubmission(evt)) {
				return false;
			}
		}
		setIsLoading(false);
		return false;
	}

	useEffect(() => {
		FetchManager.fetch({
			url: BODY_PARTS_URL,
			success_cb: (res) => {
				setBodyParts(res.body);
				setIsLoading(false);
			}
		})
	}, []);

	return (
		<Box sx={{ minWidth: "600px", maxHeight: "400px" }}>
			<Typography mb={2} variant='body2' >Edit: {exercise.title}</Typography>
			<Stepper activeStep={step} mb={2}>
				<Step key={"text"}>
					<StepLabel >{"Text"}</StepLabel>
				</Step>
				<Step key={"images"}>
					<StepLabel >{"Images"}</StepLabel>
				</Step>
				<Step key={"audio"}>
					<StepLabel >{"Audio"}</StepLabel>
				</Step>
				<Step key={"video"}>
					<StepLabel >{"Video"}</StepLabel>
				</Step>
			</Stepper>
			<Fragment>
				<Box p={3} sx={{ minWidth: "500px" }}>
					{step === 0 &&
						<Box >
							<Box className={styles.formInput}>
								<FormControl fullWidth>
									<FormLabel>Title</FormLabel>
									<TextField size={"small"} disabled={isLoading} required id="title" placeholder="Title" name="title" onChange={handleFormChange} value={formData.title} />
								</FormControl>
							</Box>
							<Box className={styles.formInput} mt={1}>
								<FormControl fullWidth>
									<FormLabel>Body Part</FormLabel>
									<TextField size={"small"} disabled={isLoading} required id="bodyPart" name="bodyPart" placeholder="Body Part" onChange={handleFormChange} value={formData.bodyPart} select>
										{bodyParts.map(item => (<MenuItem key={item._id} value={item._id}>{item.name.toLocaleUpperCase()}</MenuItem>))}
									</TextField>
								</FormControl>
							</Box>
							<Box className={styles.formInput} sx={{ marginTop: 2 }}>
								<FormControl fullWidth>
									<FormLabel>Description</FormLabel>
									<TextField size={"small"} disabled={isLoading} multiline rows={2} placeholder="Description...." required id="description" name="description" onChange={handleFormChange} value={formData.description} />
								</FormControl>
							</Box>
						</Box>
					}
					{step === 1 &&
						<Box>
							<Box className={styles.formInput} sx={{ marginTop: 1 }}>
								<Box component={"img"} my={1} sx={{ width: "70px" }} src={placeholders.thumbImage} />
								<FormControl fullWidth>
									<FormLabel>Thumbnail(.jpeg,.jpg,.png)</FormLabel>
									<TextField size={"small"} disabled={isLoading} required id="thumbImage" name="thumbImage" accept=".jpeg,.jpg,.png" InputProps={{ type: "file", accept: ".jpeg,.jpg,.png" }} onChange={handleFileSelect} />
								</FormControl>
							</Box>
							<Box className={styles.formInput} sx={{ marginTop: 1 }}>
								<Box component={"img"} my={1} sx={{ width: "70px" }} src={placeholders.image} />
								<FormControl fullWidth>
									<FormLabel>Demostration Image(.jpeg,.jpg,.png)</FormLabel>
									<TextField size={"small"} disabled={isLoading} required id="image" name="image" InputProps={{ type: "file", accept: ".jpeg,.jpg,.png" }} onChange={handleFileSelect} />
								</FormControl>
							</Box>
						</Box>
					}
					{step === 2 &&
						<Box sx={{ minHeight: "150px" }}>
							<Box className={styles.formInput} sx={{ marginTop: 1 }}>
								<Box component={placeholders.audio === "" ? "img" : "audio"} controls my={1} sx={{ width: "200px" }} src={placeholders.audio === "" ? "/static/img/placeholder-audio.png" : placeholders.audio} />
								<FormControl fullWidth>
									<FormLabel>Audio Commentary(.mp3)</FormLabel>
									<TextField size={"small"} disabled={isLoading} required id="audio" name="audio" InputProps={{ type: "file", accept: ".mp3" }} onChange={handleFileSelect} />
								</FormControl>
							</Box>
						</Box>
					}
					{step === 3 &&
						<Box>
							<Box className={styles.formInput} sx={{ marginTop: 1 }}>
								<Box component={placeholders.video === "" ? "img" : "video"} controls my={1} sx={{ width: "100%", maxHeight: "200px", objectFit: "cover" }} src={placeholders.video === "" ? "/static/img/placeholder-vid.jpg" : placeholders.video} />
								<FormControl fullWidth>
									<FormLabel>Demostration Video(.mp4)</FormLabel>
									<TextField size={"small"} disabled={isLoading} required id="video" name="video" InputProps={{ type: "file", accept: ".mp4" }} onChange={handleFileSelect} />
								</FormControl>
							</Box>
						</Box>
					}
				</Box>
			</Fragment>
			<Box mt={2} px={3} display={"flex"} justifyContent={"space-between"}>
				<Button type='submit' disabled={isLoading || step === 0} onClick={previousStepHandler}>Previous</Button>
				<Button type="submit" disabled={isLoading} onClick={nextSaveHandler}>Save</Button>
				<Button type='submit' disabled={isLoading || step === 3} onClick={nextStepHandler}>Next</Button>
			</Box>
		</Box>
	);
}

export default EditExerciseForm;
