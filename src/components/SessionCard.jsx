import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CalendarMonth } from '@mui/icons-material';
import Button from './Button';
import { useNavigate } from "react-router-dom";
export default function SessionCard({session}) {
	const navigate = useNavigate();
	const open_session = () => {
		navigate(`/sessions/${session._id}`);
	}
	return (
		<Card sx={{ display: 'flex' }}>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<CardContent sx={{ flex: '1 0 auto' }}>
					<Typography component="div" variant="subtitle1">
						{session.healthProfessional}
					</Typography>
					<Typography variant="subtitle2" color="text.secondary" component="div">
						{session.healthProfessionalType}
					</Typography>
					<Typography variant="subtitle2" color="text.secondary" component="div">
						{session.date} - {session.time}
					</Typography>
				</CardContent>
				<Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
					<Button variant="contained" color="primary" href="#" onClick={open_session}>
						Start Session
					</Button>
				</Box>
			</Box>
			<CalendarMonth sx={{width: "60px", height: "80px"}} />
		</Card>
	);
}
