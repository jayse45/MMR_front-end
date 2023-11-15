import { Box, Grid, Typography } from '@mui/material';
const ViewUser = ({ admin }) => {
	return (
		<Box>
			<Grid container rowSpacing={2}>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Name</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{admin.name}</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Email</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{admin.email}</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Created At</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{admin.createdAt}</Typography>
				</Grid>
				<Grid item xs={4}>
					<Typography variant='subtitle2'>Updated At</Typography>
				</Grid>
				<Grid item xs={8}>
					<Typography variant='body1'>{admin.updatedAt}</Typography>
				</Grid>
			</Grid>
		</Box>
	);
}

export default ViewUser;
