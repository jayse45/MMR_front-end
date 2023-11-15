import { Box, Grid, Typography } from '@mui/material';
import ConfigurationManager from '../../../utils/ConfigurationManager';

const ViewUser = ({ user }) => {
	return (
		<Box>
			<Grid container rowSpacing={2}>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Name</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{user.name}</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Email</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{user.email}</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Role</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{ConfigurationManager.getConfig("ROLE_KEYS")[user.role]}</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Date of Birth</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{user.dob? new Date(user.dob).toLocaleDateString([], { dateStyle: "medium" }) : "N/A"}</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Phone</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{user?.phone?.dialCode} {user?.phone?.number}</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Country</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{user?.preferences?.country}</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Timezone</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{user?.preferences?.timezone}</Typography>
				</Grid>
			</Grid>
		</Box>
	);
}

export default ViewUser;
