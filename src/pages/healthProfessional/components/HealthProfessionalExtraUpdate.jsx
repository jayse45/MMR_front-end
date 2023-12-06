import { Box, FormControl, TextField, FormLabel, Grid, MenuItem, ImageListItem, ImageListItemBar } from '@mui/material'
import { useEffect, useState } from 'react'
import { CheckCircle, Edit, PendingActions, Save } from '@mui/icons-material'
import { UrlHelper } from '../../../utils/UrlHelper';
import NotificationManager from '../../../utils/NotificationManager';
import FetchManager from '../../../utils/FetchManager';
import Button from '../../../components/Button';
import ModalIconButton from '../../../components/Modal/ModalIconButton';
import StorageManager from '../../../utils/StorageManager';
import LoadingCircle from '../../../components/LoadingCircle';

const PRESIGNED_URL = UrlHelper.createApiUrlPath("/api/storage/presignedUrl");
const USERS_URL = UrlHelper.createApiUrlPath("/api/users/");
const HEALTH_PROFESSIONAL_TYPE_URL = UrlHelper.createApiUrlPath("/api/healthprofessionalTypes");

const HealthProfessionalExtraUpdate = () => {
	const [loading, setLoading] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const [photo, setPhoto] = useState(null);
	const [healthprofessionaltypes, setHealthprofessionaltypes] = useState([]);
	const [userData, setUserData] = useState({
		yearStarted: "",
		healthProfessionalType: '',
		licensePicture: {
			key: "",
			url: "",
			status: "",
		},
		bio: "",
		address: "",
		workplace: "",
		licenseNumber: "",
	});
	const handleDpSelect = (evt) => {
		setPreviewImage(URL.createObjectURL(evt.target.files[0]));
		setPhoto(evt.target.files[0])
	}

	const handleChange = (evt) => {
		setUserData({
			...userData,
			[evt.target.name]: evt.target.value
		});
	}

	const changeLicenseImage = async (evt) => {
		evt.preventDefault();
		setLoading(true);
		if (photo === "" || photo === null) {
			setLoading(false);
			return NotificationManager.notifyUser({ type: "info", message: "Profile image is required", toastId: 1 })
		}

		const dpPresignedUrl = await FetchManager.asycnFetchJSON({
			url: PRESIGNED_URL, method: "POST",
			body: {
				fileType: photo.type,
				key: userData.licensePicture.key
			}
		})
		const dpResponse = await fetch(dpPresignedUrl.body, {
			method: "PUT",
			headers: {
				'content-type': photo.type,
				'content-length': photo.size,
			},
			body: photo
		})

		if (dpResponse.statusText !== "OK") {

			NotificationManager.notifyUser({ type: "error", message: "Sorry, could not upload image.", toastId: 1 })
			setLoading(false);
			return false;
		}
		const addedLicense = await FetchManager.asycnFetchJSON({
			url: `${USERS_URL}addedLicense`,
			method: "PUT",
		})
		if (addedLicense.status === 200) {
			NotificationManager.notifyUser({ type: "success", message: "Image Uploaded", toastId: 1 })
			setLoading(false);
			return true;
		}else{
			NotificationManager.notifyUser({ type: "error", message: "Sorry, could not complete the upload process.", toastId: 1 })
			setLoading(false);
			return false;
		}
	}
	const saveBasicBio = async (evt) => {
		evt.preventDefault();
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
			} else {
				NotificationManager.notifyUser({ type: "warning", message: "Failed to save." })
			}

			setLoading(false)
		}
	}
	const onErrorImage = () => {
		const image = document.querySelector("#licensePreview1");
		if (image) {
			image.onerror = () => {
				image.src = "/license-placeholder.jpg"
			}
		}
	}
	useEffect(() => {
		setLoading(true);
		Promise.all([FetchManager.asycnFetchJSON({
			url: HEALTH_PROFESSIONAL_TYPE_URL,
		}), FetchManager.asycnFetchJSON({
			url: `${USERS_URL}healthProfessionalExtra`,
		})]).then((res) => {
			setHealthprofessionaltypes(res[0].body);
			setUserData({
				...res[1].body,
				healthProfessionalType: res[1].body.healthProfessionalType._id,
			});
			StorageManager.set("licenseVerified", res[1]?.body?.licensePicture?.status === "approved")
			setPreviewImage(res[1].body.licensePicture.url)
			const image1 = document.querySelector("#licensePreview");
			if (image1) {
				image1.onerror = () => {
					image1.src = "/license-placeholder.jpg"
				}
			}
			setLoading(false);
		})

	}, [])
	return (
		<Box minHeight={"60vh"}>
			{loading ? <LoadingCircle /> :
				<Grid container spacing={5} justifyContent="center">
					<Grid item xs={12} sm={4} md={4} xl={3} pr={3}>
						<ImageListItem key={previewImage} sx={{ backgroundColor: "#26c28129", height: "200px!important", borderRadius: "3px", border: "5px solid #00000080" }}>
							<img
								src={previewImage}
								alt={"license"}
								loading="lazy"
							/>
							<ImageListItemBar
								sx={{
									backgroundColor: '#00000000',
								}}
								actionIcon={
									<>
										{userData.licensePicture.status === "approved" ?
											<Box>
												<CheckCircle titleAccess="Approved" title="Approved" color="success" />
											</Box>
											:
											<>{userData.licensePicture.status === "added" ?
												<Box>
													<PendingActions titleAccess="Under Review" title="Under Review" color="info" />
												</Box>
												: <ModalIconButton sx={{ color: 'white' }} onClick={changeLicenseImage} title="Update License" icon={
													<Edit
														sx={{
															color: "white",
															width: "40px",
															height: "40px",
															padding: "8px",
															borderRadius: "50%",
															backgroundColor: "#00000082"
														}} />} onReady={onErrorImage}>
													<Box component={"form"} onSubmit={changeLicenseImage} sx={{ minHeight: "300px" }}>
														<Box sx={{ display: "flex", justifyContent: "center" }}>
															<Box id="licensePreview1" mb={2} sx={{ height: "200px", objectFit: "cover" }} component="img" src={previewImage} alt="User Profile" title='profile picture' loading="lazy" />
														</Box>
														<FormControl fullWidth>
															<FormLabel>License Image(.jpeg,.jpg,.png, gif)</FormLabel>
															<TextField size={"small"} disabled={loading} required id="photo" name="photo"
																accept=".jpeg,.jpg,.png,.gif"
																InputProps={{ type: "file", accept: ".jpeg,.jpg,.png,.gif" }}
																onChange={handleDpSelect} />
														</FormControl>
														<Box>
															<Button type="submit" disabled={loading} onClick={changeLicenseImage}><Edit /> Update</Button>
														</Box>
													</Box>
												</ModalIconButton>
											}</>
										}
									</>
								}
								actionPosition="left"
							/>
						</ImageListItem>
					</Grid>
					<Grid item xs={12} sm={7} md={7} xl={6}>
						<Box component="form" onSubmit={saveBasicBio} sx={{ marginX: 3 }}>
							<FormControl fullWidth>
								<TextField size="small" required id="healthProfessionalType" name="healthProfessionalType" label="Area of Specialization" onChange={handleChange} value={userData.healthProfessionalType} select>
									{healthprofessionaltypes.map(item => (<MenuItem key={item._id} value={item._id}>{item.name.toLocaleUpperCase()}</MenuItem>))}
								</TextField>
							</FormControl>
							<FormControl fullWidth sx={{ marginTop: 1 }}>
								<TextField size="small" required id="yearStarted" name="yearStarted" label="Year Started" onChange={handleChange} value={userData.yearStarted} select>
									{Array.from(Array(60).keys()).map(x => new Date().getFullYear() - x).map(item => (<MenuItem key={item} value={item}>{item}</MenuItem>))}
								</TextField>
							</FormControl>
							<Box my={1}>
								<TextField disabled={["approved", "added"].includes(userData.licensePicture.status)} size="small" fullWidth label="License Pin" name='licenseNumber' onChange={handleChange} value={userData.licenseNumber} />
							</Box>
							<Box my={1}>
								<TextField size="small" fullWidth label="Workplace" placeholder="Current place of practice" name="workplace" onChange={handleChange} value={userData.workplace} />
							</Box>

							<Box my={1}>
								<TextField size="small" fullWidth label="Address" placeholder="Address" name='address' onChange={handleChange} value={userData.address} />
							</Box>
							<Box my={1}>
								<TextField multiline rows={3} fullWidth label="Bio" placeholder="Introduce yourself" name="bio" onChange={handleChange} value={userData.bio} />
							</Box>
							<Box mt={1}>
								<Button disabled={loading} onClick={saveBasicBio}><Save /> Save</Button>
							</Box>
						</Box>
					</Grid>
				</Grid>
			}
		</Box>

	)
}
export default HealthProfessionalExtraUpdate;
