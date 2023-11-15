import { Box, CircularProgress } from '@mui/material';
const LoadingCircle = () => {
	const styles = {
		display: "flex",
		width: "100%",
		height: "100%",
		minHeight: "200px",
		justifyContent: "center",
		justifyItems: "center",
		alignContent: "center",
		alignItems: "center",
	}

	return (
		<Box sx={styles}>
			<CircularProgress sx={{ color: "#0474E8" }} />
		</Box>
	)

}

export default LoadingCircle;
