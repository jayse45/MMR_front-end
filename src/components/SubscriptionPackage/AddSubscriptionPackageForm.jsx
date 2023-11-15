import { Box, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, MenuItem, Switch, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import RichTextEditor from 'react-rte';
import ConfigurationManager from '../../utils/ConfigurationManager';
import FetchManager from '../../utils/FetchManager';
import NotificationManager from '../../utils/NotificationManager';
import { UrlHelper } from '../../utils/UrlHelper';
import Button from '../Button';
import LoadingCircle from '../LoadingCircle';

const styles = {
	formInput: {
		margin: "1em 0.5rem"
	}
}
const toolbarConfig = {
	// Optionally specify the groups to display (displayed in the order listed).
	display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
	INLINE_STYLE_BUTTONS: [
		{ label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
		{ label: 'Italic', style: 'ITALIC' },
		{ label: 'Underline', style: 'UNDERLINE' }
	],
	BLOCK_TYPE_DROPDOWN: [
		{ label: 'Normal', style: 'unstyled' },
		{ label: 'Heading Large', style: 'header-one' },
		{ label: 'Heading Medium', style: 'header-two' },
		{ label: 'Heading Small', style: 'header-three' }
	],
	BLOCK_TYPE_BUTTONS: [
		{ label: 'UL', style: 'unordered-list-item' },
		{ label: 'OL', style: 'ordered-list-item' }
	]
};

const SUBSCRIPTION_URL = UrlHelper.createApiUrlPath("/api/subscriptionPackages/")

const AddSubscriptionPackageForm = () => {
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		price: "",
		duration: "",
		duration_text: "",
		disabled: true,
		userType: "",
		currency: "GHS"

	})
	const [descriptionText, setDescriptionText] = useState(RichTextEditor.createEmptyValue());
	const userRoles = ConfigurationManager.getConfig("ROLES");
	const onChangeText = (input) => {
		setDescriptionText(input);
	};

	const handleFormChange = (evt) => {
		setFormData({
			...formData,
			[evt.target.name]: evt.target.value
		})
	}

	const handleSwitchChanged = (evt) => {
		setFormData({
			...formData,
			disabled: evt.target.checked
		})
	}

	const handleSubmission = (evt) => {
		evt.preventDefault();
		setLoading(true);
		const body = formData;
		body.description = descriptionText.toString('html');

		FetchManager.fetch({
			url: SUBSCRIPTION_URL,
			method: "POST",
			body,
			success_cb: (res) => {
				if (res.status === 201) {
					NotificationManager.notifyUser({ message: "Package created successfully", type: "success", toastId: 1 })
					setTimeout(() => {
						window.location.reload()
					}, 1000);
				} else {
					NotificationManager.notifyUser({ message: res.errors[0].msg, type: "info", toastId: 1 });
					setLoading(false);
				}
			},
			failure_cb: (res) => {
				NotificationManager.notifyUser({ message: "Failed to create package", type: "warning", toastId: 1 })
				setLoading(false);
			}
		})
	}

	return (
		<Box sx={{ minWidth: "500px" }}>
			{loading && <LoadingCircle />}
			{!loading &&
				<Box component="form">
					<Typography variant='h5' >Create Subscription Package</Typography>
					<Grid container spacing={1}>
						<Grid item lg={7} md={6} xs={12}>
							<Box className={styles.formInput} sx={{ marginTop: 2 }}>
								<FormControl fullWidth>
									<TextField size='small'  required id="title" name="title" placeholder="Title" onChange={handleFormChange} value={formData.title} />
								</FormControl>
							</Box>
						</Grid>
						<Grid item lg={5} md={6} xs={12}>
							<Box className={styles.formInput} sx={{ marginTop: 2 }}>
								<FormControl fullWidth>
									<TextField size='small' select  required id="userType" name="userType" placeholder="User Role" onChange={handleFormChange} value={formData.userType}>
										{Object.keys(userRoles).map((item) => {
											if (item === "ADMIN") return "";
											return <MenuItem key={item} value={userRoles[item] ?? ""} >{item.replace("_", " ")}</MenuItem>
										})}
									</TextField>
								</FormControl>
							</Box>
						</Grid>
					</Grid>
					<Box className={styles.formInput} sx={{ marginTop: 2 }}>
						<FormControl fullWidth>
							<RichTextEditor
								toolbarConfig={toolbarConfig}
								value={descriptionText}
								onChange={onChangeText}
							/>
							<FormHelperText id="description-helper-text">Description for the package.</FormHelperText>
						</FormControl>
					</Box>
					<Box className={styles.formInput} sx={{ marginTop: 2 }}>
						<Grid container spacing={1}>
							<Grid item lg={5} md={5} xs={12}>
								<FormControl fullWidth>
									<TextField size='small'  type="number" required id="duration" name="duration" placeholder='Duration*' onChange={handleFormChange} value={formData.duration} />
								</FormControl>
							</Grid>
							<Grid item lg={2} md={2} xs={4}>
								<FormControl fullWidth>
									<TextField
										id="outlined-select-currency"
										select
										value="GHS"
										size='small'
										required
										
									>
										<MenuItem key={"GHS"} value={"GHS"}>
											Gh₵
										</MenuItem>
									</TextField>
								</FormControl>
							</Grid>
							<Grid item lg={5} md={5} xs={8}>
								<FormControl fullWidth>
									<TextField size='small' type="number"  required id="price" name="price" placeholder="Price*" onChange={handleFormChange} value={formData.price} />
								</FormControl>
							</Grid>
						</Grid>
					</Box>
					<Box className={styles.formInput} sx={{ marginTop: 2, marginBottom: 2 }}>
						<FormControl fullWidth>
							<TextField size='small' required id="duration_text"  name="duration_text" placeholder="Display Duration" onChange={handleFormChange} value={formData.duration_text} />
						</FormControl>
					</Box>
					<Box className={styles.formInput} sx={{ marginTop: 2 }}>
						<FormGroup>
							<FormControlLabel control={<Switch checked={formData.disabled} onChange={handleSwitchChanged} inputProps={{ 'aria-label': 'controlled' }} />} label="Disable?" />
						</FormGroup>
					</Box>
					<Box>
						<Button type="submit" onClick={handleSubmission}>Create Package</Button>
					</Box>
				</Box>
			}
		</Box>
	);
}

export default AddSubscriptionPackageForm;
