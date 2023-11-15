import { useEffect, useState } from 'react'
import { Box, FormControl, FormHelperText, FormLabel, Grid, MenuItem, Paper, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import Button from '../../../components/Button';
import FetchManager from '../../../utils/FetchManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import NotificationManager from '../../../utils/NotificationManager';
import LoadingCircle from '../../../components/LoadingCircle';
import StorageManager from '../../../utils/StorageManager';

const PRESIGNED_URL = UrlHelper.createApiUrlPath("/api/storage/presignedUrl");
const USERS_URL = UrlHelper.createApiUrlPath("/api/users/");
const HEALTH_PROFESSIONAL_TYPE_URL = UrlHelper.createApiUrlPath("/api/healthprofessionalTypes");

export default function OnboardHealthProfessional() {
	const [isLoading, setLoading] = useState(true);
	const [userData, setUserData] = useState({
		yearStarted: "",
		healthProfessionalType: '',
		licensePicture: {
			key: "",
			url: "",
		},
		photo: {
			key: ""
		},
		bio: "",
		address: "",
		workplace: "",
		licenseNumber: "",
	});
	const [files, setFiles] = useState({
		photo: null,
		licensePicture: null
	});
	const [healthprofessionaltypes, setHealthprofessionaltypes] = useState([]);
	const [step, setStep] = useState(0);
	const [previewImages, setPreviewImages] = useState({
		photo: "/dp-placeholder.png",
		licensePicture: "/license-placeholder.jpg",
	});

	const handleChange = (evt) => {
		setUserData({
			...userData,
			[evt.target.name]: evt.target.value
		});
	}
	const handleFileSelect = (evt) => {
		setPreviewImages({
			...previewImages,
			[evt.target.name]: URL.createObjectURL(evt.target.files[0])
		});
		setFiles({
			...files,
			[evt.target.name]: evt.target.files[0]
		})
	}
	const nextStepHandler = (evt) => {
		if (step < 3) {
			setStep(step + 1);
		}
	}
	const saveBasicBio = async (evt) => {
		setLoading(true);
		const body = {
			healthProfessionalType: userData.healthProfessionalType,
			licenseNumber: userData.licenseNumber,
			bio: userData.bio,
			address: userData.address,
			workplace: userData.workplace,
			yearStarted: userData.yearStarted
		}
		let status = false;
		Object.keys(body).forEach(item => {
			if (body[item] === "") {
				if (item === "healthProfessionalType") {
					item = "Area of Specialization";
				} else {
					item = item.replaceAll(/[A-Z]/g, " $&")
					item = item[0].toUpperCase() + item.substring(1);
				}
				NotificationManager.notifyUser({
					type: "info",
					message: `${item} is required.`,
					timer: 1000,
				})
				status = true;
			}
		})
		if (status) {
			setLoading(false);
		} else {
			const res = await FetchManager.asycnFetchJSON({
				url: `${USERS_URL}healthProfessionalExtra`,
				method: "PUT",
				body,
			});
			if (res.status === 200) {
				setUserData({
					...userData,
					...res.body.healthProfessionalExtraData,
				})
				NotificationManager.notifyUser({ type: "success", message: "Saved." });
				nextStepHandler(evt);
			} else {
				NotificationManager.notifyUser({ type: "warning", message: "Failed to save." })
			}
			setLoading(false)
		}
	}

	const uploadFile = async (field) => {
		setLoading(true);
		if (files[field] === "" || files[field] === null) {
			setLoading(false);
			return NotificationManager.notifyUser({ type: "info", message: `${field} image is required`, toastId: 1 })
		}

		const presignedUrl = await FetchManager.asycnFetchJSON({
			url: PRESIGNED_URL, method: "POST",
			body: {
				fileType: files[field].type,
				key: userData[field].key
			}
		})
		const dpResponse = await fetch(presignedUrl.body, {
			method: "PUT",
			headers: {
				'content-type': files[field].type,
				'content-length': files[field].size,
			},
			body: files[field]
		})

		if (dpResponse.statusText !== "OK") {
			NotificationManager.notifyUser({ type: "error", message: "Sorry, could not upload image.", toastId: 1 })
			setLoading(false);
			return false;
		}

		NotificationManager.notifyUser({ type: "success", message: "File Uploaded", toastId: 1 })
		if (field === "photo") {
			nextStepHandler();
			setLoading(false);
		}
		if (field === "licensePicture") {
			const addedLicense = await FetchManager.asycnFetchJSON({
				url:`${USERS_URL}addedLicense`,
				method: "PUT",
			})
			if (addedLicense.status !== 200) {
				NotificationManager.notifyUser({ type: "error", message: "Sorry, could not complete the process.", toastId: 1 })
				return false;
			}
		}
		return true;

	}

	const completeProfile = async (evt) => {
		const res = await FetchManager.asycnFetchJSON({
			url: `${USERS_URL}completeUserOnboarding`,
			method: "PUT",
		});
		if (res.status === 200) {
			StorageManager.set("onboarded", true);
			NotificationManager.notifyUser({ type: "info", message: "Profile completed.", toastId: 1 })
			window.location.reload();
		}
	}

	const nextSaveHandler = async (evt) => {
		evt.preventDefault();
		switch (step) {
			case 0: await saveBasicBio(evt);
				break;
			case 1: await uploadFile("photo");
				break;
			case 2: await uploadFile("licensePicture");
				completeProfile(evt);
				break;
			default:
				break;
		}
	}

	useEffect(() => {
		Promise.all([FetchManager.asycnFetchJSON({
			url: HEALTH_PROFESSIONAL_TYPE_URL,
		}), FetchManager.asycnFetchJSON({
			url: `${USERS_URL}info`,
		})]).then((res) => {
			setHealthprofessionaltypes(res[0].body);
			setUserData({
				...userData,
				...res[1].body,
				...res[1].body.healthProfessionalExtraData
			});
			setLoading(false);
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<Box mx={2} my={2}>
			<Paper elevation={3} >
				<Box sx={{ paddingTop: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
					<img height={"70px"} src="/static/img/logo.png" alt="MonitorMyRehab" />
					<Typography variant='h5' mt={1} sx={{ fontSize: "1.2rem" }}>Complete your profile to continue</Typography>
				</Box>
				<Box sx={{ paddingX: 1, minHeight: "70vh" }} >
					<Grid container justifyContent={"center"} >
						{isLoading ? <LoadingCircle /> :
							<Grid item xs={12} sm={8} md={7} lg={6} xl={4} sx={{ paddingY: 2 }}>
								<Stepper activeStep={step} sx={{ marginY: 1, padding: 1, border: "1px solid #0474e829" }}>
									<Step key={0}><StepLabel>Basic Bio</StepLabel></Step>
									<Step key={2}><StepLabel>Picture</StepLabel></Step>
									<Step key={3}><StepLabel>License</StepLabel></Step>
								</Stepper>
								{step === 0 &&
									<Box component="form" onSubmit={nextSaveHandler} sx={{ marginX: 3 }}>
										<FormControl fullWidth>
											<TextField size="small" required id="healthProfessionalType" name="healthProfessionalType" label="Area of Specialization" onChange={handleChange} value={userData.healthProfessionalType} select>
												{healthprofessionaltypes.map(item => (<MenuItem key={item._id} value={item._id}>{item.name.toLocaleUpperCase()}</MenuItem>))}
											</TextField>
											<FormHelperText id="HealthProfessionalType-helper-text">Area of specialization</FormHelperText>
										</FormControl>
										<FormControl fullWidth>
											<TextField size="small" required id="yearStarted" name="yearStarted" label="Year Started" onChange={handleChange} value={userData.yearStarted} select>
												{Array.from(Array(60).keys()).map(x => new Date().getFullYear() - x).map(item => (<MenuItem key={item} value={item}>{item}</MenuItem>))}
											</TextField>
											<FormHelperText id="HealthProfessionalType-helper-text">Year you started your practice</FormHelperText>
										</FormControl>
										<Box my={1}>
											<TextField size="small" fullWidth placeholder="License Pin" name='licenseNumber' onChange={handleChange} value={userData.licenseNumber} />
										</Box>
										<Box my={1}>
											<TextField size="small" fullWidth placeholder="Current place of practice" name="workplace" onChange={handleChange} value={userData.workplace} />
										</Box>

										<Box my={1}>
											<TextField size="small" fullWidth placeholder="Address" name='address' onChange={handleChange} value={userData.address} />
										</Box>
										<Box my={1}>
											<TextField multiline rows={3} fullWidth placeholder="Introduce yourself" name="bio" onChange={handleChange} value={userData.bio} />
										</Box>

									</Box>
								}
								{step === 1 &&
									<Box sx={{ display: "flex", justifyContent: "center" }}>
										<Box sx={{ maxWidth: "250px" }}>
											<Box sx={{ display: "flex", justifyContent: "center" }}>
												<Box mb={2} sx={{ p: 1, borderRadius: "1em", border: "1px solid #80808047", width: "100%", heigth: "100%", objectFit: "cover" }} component="img" src={previewImages.photo} alt="User Profile" title='profile picture' loading="lazy" />
											</Box>
											<FormControl fullWidth>
												<FormLabel>Profile Image(.jpeg,.jpg,.png, gif)</FormLabel>
												<TextField size={"small"} disabled={isLoading} required id="photo" name="photo"
													InputProps={{ type: "file", accept: ".jpeg,.jpg,.png,.gif" }}
													onChange={handleFileSelect} />
											</FormControl>
										</Box>
									</Box>
								}
								{step === 2 &&
									<Box sx={{ display: "flex", justifyContent: "center" }}>
										<Box sx={{ maxWidth: "300px" }}>
											<Box sx={{ display: "flex", justifyContent: "center" }}>
												<Box mb={2} sx={{ p: 1, borderRadius: "1em", border: "1px solid #80808047", width: "100%", heigth: "100%", objectFit: "cover" }} component="img" src={previewImages.licensePicture} alt="License Picture" title='License Picture' loading="lazy" />
											</Box>
											<FormControl fullWidth>
												<FormLabel>License (.jpeg,.jpg,.png, gif)</FormLabel>
												<TextField size={"small"} disabled={isLoading} required id="licensePicture" name="licensePicture"
													InputProps={{ type: "file", accept: ".jpeg,.jpg,.png,.gif" }}
													onChange={handleFileSelect} />
											</FormControl>
										</Box>
									</Box>
								}
								<Box mt={2} px={3} display={"flex"} justifyContent={"flex-end"}>
									<Button type="submit" disabled={isLoading} onClick={nextSaveHandler}>{step < 3 ? "Continue" : "Complete Profile"}</Button>
								</Box>
							</Grid>
						}
					</Grid>
				</Box>
			</Paper>
		</Box>
	)
}
