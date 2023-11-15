import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box, Grid, Typography, CircularProgress, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import NavListItems from './components/NavListItems';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import {
	AccountBox as AccountBoxIcon,
	HourglassBottom as HourglassBottomIcon,
	QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';
import { useParams } from "react-router-dom";
import NotFoundPage from '../../components/NotFoundPage';
import Meeting from '../../components/Meeting';
import DiagnosisForm from './components/DiagnosisForm';
import PrescriptionForm from './components/PrescriptionForm';
import PatientHistory from './components/PatientHistory';
const SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/users/");

const SessionPage = () => {
	const [session, setSession] = useState([]);
	const [loading, setLoading] = useState(true);
	const [validPage, setValidPage] = useState(true);
	const [subPage, setSubPage] = useState(0);
	const [refetch, setRefetch] = useState(false);
	const params = useParams();
	const reload = () => {
		setRefetch(!refetch);
	}

	useEffect(() => {
		if (!params.session_id) {
			setValidPage(false);
		} else {
			FetchManager.fetch({
				url: SESSIONS_URL + params.session_id,
				success_cb: (res) => {
					const healthProfessionalType = res.body.healthProfessionalType.name;
					const healthProfessional = res.body.healthProfessional.name;
					const patient = res.body.patient.name;
					const response = {
						...res.body,
						healthProfessionalType,
						healthProfessional,
						patientId: res.body.patient._id,
						patient,
						date: new Date(res.body.timestamp).toLocaleDateString(),
						time: new Date(res.body.timestamp).toLocaleTimeString()
					}
					setLoading(false)
					setSession(response);
				}
			})
		}
		//eslint-disable-next-line
	}, [refetch]);
	return (
		<Layout navList={NavListItems} page={`Session with ${session.patient ?? '...'}`} openDrawer={false}>
			<Box component={"section"}>
				{validPage ?
					<Grid container spacing={2}>
						<Grid item xs={12} md={6} lg={7} xl={8}>
							<Meeting roomName={params.session_id} userName={session.healthProfessional} />
						</Grid>
						<Grid item xs={12} md={6} lg={5} xl={4}>
							{loading ?
								<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
									<CircularProgress sx={{ width: "100px", height: "100px" }} />
								</Box>
								:
								<>
									<Paper sx={{ p: "0.5em 1em", mb: 1 }}>
										<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
											<Typography variant='caption'>Patient:</Typography>
											<Typography variant='subtitle1'>{session.patient.toLocaleUpperCase()}</Typography>
										</Box>
										<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
											<Typography variant='caption'>Schedule:</Typography>
											<Typography variant='subtitle1'>{session.date} - {session.time}</Typography>
										</Box>
									</Paper>
									<Paper variant="outlined">
										<Paper elevation={3}>
											<BottomNavigation
												showLabels
												value={subPage}
												onChange={(event, newValue) => {
													setSubPage(newValue);
												}}
											>
												<BottomNavigationAction label="History" icon={<HourglassBottomIcon />} />
												<BottomNavigationAction label="Diagosis" icon={<QuestionAnswerIcon />} />
												<BottomNavigationAction label="Prescription" icon={<AccountBoxIcon />} />
											</BottomNavigation>
										</Paper>
										<Box sx={{ p: "1.5em 0.5em 1em 0.5em" }}>
											{subPage === 0 && <PatientHistory userId={session.patientId} />}
											{subPage === 1 && <DiagnosisForm session={session} reload={reload} />}
											{subPage === 2 && <PrescriptionForm session={session} reload={reload} />}
										</Box>
									</Paper>
								</>
							}
						</Grid>
					</Grid>
					:
					<NotFoundPage />
				}
			</Box>
		</Layout>
	);
}

export default SessionPage;
