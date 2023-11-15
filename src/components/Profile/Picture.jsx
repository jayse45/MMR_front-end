import { Box, FormControl, TextField, FormLabel, ImageListItem, ImageListItemBar } from '@mui/material'
import { useState } from 'react'
import { Edit } from '@mui/icons-material'
import NotificationManager from '../../utils/NotificationManager';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import Button from '../Button';
import ModalIconButton from '../Modal/ModalIconButton';

const PRESIGNED_URL = UrlHelper.createApiUrlPath("/api/storage/presignedUrl");

const Picture = ({ image = { url: "/dp-placeholder.png" } }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [previewImage, setPreviewImage] = useState(image.url ?? "/dp-placeholder.png");
	const [photo, setPhoto] = useState(null);

	const handleDpSelect = (evt) => {
		setPreviewImage(URL.createObjectURL(evt.target.files[0]));
		setPhoto(evt.target.files[0])
	}

	const changePicture = async (evt) => {
		evt.preventDefault();
		setIsLoading(true);
		if (photo === "" || photo === null) {
			setIsLoading(false);
			return NotificationManager.notifyUser({ type: "info", message: "Profile image is required", toastId: 1 })
		}

		const dpPresignedUrl = await FetchManager.asycnFetchJSON({
			url: PRESIGNED_URL, method: "POST",
			body: {
				fileType: photo.type,
				key: image.key
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
			setIsLoading(false);
			return false;
		}

		NotificationManager.notifyUser({ type: "success", message: "Image Uploaded", toastId: 1 })
		return true;

	}
	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<ImageListItem key={previewImage} sx={{ backgroundColor: "#26c28129", width: "195px", height: "200px!important", borderRadius: "3px", border: "5px solid #00000080" }} >
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
						<ModalIconButton sx={{ color: "white", padding: "0px!important" }} onClick={changePicture} title="Change Picture" icon={
							<Edit
								sx={{
									color: "white",
									width: "40px",
									height: "40px",
									padding: "8px",
									borderRadius: "50%",
									backgroundColor: "#00000082"
								}} />}>
							<Box component={"form"} onSubmit={changePicture} sx={{ minHeight: "300px" }}>
								<Box sx={{ display: "flex", justifyContent: "center" }}>
									<Box mb={2} sx={{ height: "200px", objectFit: "cover", borderRadius: "3px", border: "5px solid #00000080" }} component="img" src={previewImage} alt="User Profile" title='profile picture' loading="lazy" />
								</Box>
								<FormControl fullWidth>
									<FormLabel>Profile Image(.jpeg,.jpg,.png, gif)</FormLabel>
									<TextField size={"small"} disabled={isLoading} required id="photo" name="photo"
										InputProps={{ type: "file", accept: ".jpeg,.jpg,.png,.gif" }}
										onChange={handleDpSelect} />
								</FormControl>
								<Box mt={1}>
									<Button type="submit" disabled={isLoading} onClick={changePicture}><Edit /> Update</Button>
								</Box>
							</Box>
						</ModalIconButton>
					}
					actionPosition="left"
				/>
			</ImageListItem>
		</Box>
	)
}
export default Picture; 
