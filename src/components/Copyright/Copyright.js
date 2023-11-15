import React from "react";
import { Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Copyright(props) {
	return (<Box sx={{ marginTop: 2 }}>
		<Link color="inherit" to="#" href="#" className="font-weight-bold ml-2 no-style">
			<Typography variant="caption" component={"span"} color="textSecondary">MonitorMyRehab</Typography>
		</Link>&nbsp;&nbsp;
		<Typography variant="caption" component={"span"} color="text.primary" align="center" {...props}>
			{'Copyright © '}
			{new Date().getFullYear()}
		</Typography>
	</Box>)
}

export default Copyright;