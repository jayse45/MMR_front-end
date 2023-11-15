import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"
import Button from "./Button";

const NotFoundPage = () => {
	const navigate = useNavigate();

	const goBack = () => navigate(-1);

	return (
		<Box>
			<Typography variant="h3">Sorry</Typography>
			<br />
			<Typography variant="subtitle1">The requested page is not found.</Typography>
			<Box className="flexGrow">
				<Button onClick={goBack}>Go Back</Button>
			</Box>
		</Box>
	)
}

export default NotFoundPage
