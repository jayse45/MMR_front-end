import { Box, Link, Typography } from "@mui/material";
import Button from "./Button";

const ErrorPage = () => {

	const goBack = () => {
		window.history.back();
	}
	const reloadPage = () => {
		window.location.reload();
	}

	return (
		<Box sx={{ backgroundColor: "#eeeff9", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", margin: "10px" }}>
			<Box component="img" sx={{ height: "70vh", objectFit: "scale-down" }} src="/sadbunny.jpg" alt="Error" />
			<Box sx={{ maxWidth: "500px", minWidth: "300px", textAlign: "center" }}>
				<Typography variant="h4">We are sorry</Typography>
				<Typography variant="body2">Something went wrong. Try reloading the page.</Typography>
				<Typography variant="body2">If the problem persists please contact support.</Typography>
				<Link href="mailto:info@monitormyrehab.com">info@monitormyrehab.com</Link>
				<Box sx={{ marginY: 2, display: "flex", justifyContent: "space-around" }}>
					<Button onClick={goBack}>Go Back</Button>
					<Button onClick={reloadPage}>Reload</Button>
				</Box>
			</Box>
		</Box>
	)
}

export default ErrorPage
