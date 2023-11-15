import { Box, Paper, BottomNavigationAction, BottomNavigation, Typography } from '@mui/material';
import { useState } from 'react';
import Diagnosis from '../../../components/Sessions/Diagnosis';
import Prescription from '../../patient/components/Prescription';
import {
	AccountBox as AccountBoxIcon,
	QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';

const SessionDetails = ({ session }) => {
	const [subPage, setSubPage] = useState(0);
	return (
		<Box>
			<Box sx={{minWidth: "600px" }}>
				<Paper sx={{ p: "0.5em 1em" }}>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Typography variant='caption'>Health Professional:</Typography>
						<Typography variant='subtitle1'>{session.healthProfessional.toLocaleUpperCase()}</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Typography variant='caption'>Type:</Typography>
						<Typography variant='subtitle1'>{session.healthProfessionalType.toLocaleUpperCase()}</Typography>
					</Box>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Typography variant='caption'>Schedule:</Typography>
						<Typography variant='subtitle1'>{session.date} - {session.time}</Typography>
					</Box>
				</Paper>
				<Paper variant="outlined" sx={{ mt: 1 }}>
					<Paper elevation={3}>
						<BottomNavigation
							showLabels
							value={subPage}
							onChange={(event, newValue) => {
								setSubPage(newValue);
							}}
						>
							<BottomNavigationAction label="Diagosis" icon={<QuestionAnswerIcon />} />
							<BottomNavigationAction label="Prescription" icon={<AccountBoxIcon />} />
						</BottomNavigation>
					</Paper>
					<Box sx={{ p: "1.5em 0.5em 1em 0.5em" }}>
						{subPage === 0 && <Diagnosis sessionId={session._id} />}
						{subPage === 1 && <Prescription sessionId={session._id} layout={"landscape"}/>}
					</Box>
				</Paper>
			</Box>
		</Box>
	);
}

export default SessionDetails;
