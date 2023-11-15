import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box, Grid, Typography, CircularProgress, Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import NavListItems from './components/NavListItems';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import {
	AccountBox as AccountBoxIcon,
	QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';
import { useParams } from "react-router-dom";
import NotFoundPage from '../../components/NotFoundPage';
import Meeting from '../../components/Meeting';
import Diagnosis from '../../components/Sessions/Diagnosis';
import Prescription from './components/Prescription';
const SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/users/");

const SessionPage = () => {
	const [session, setSession] = useState({});
	const [loading, setLoading] = useState(true);
	const [validPage, setValidPage] = useState(true);
	const [subPage, setSubPage] = useState(0);
	const params = useParams();

	useEffect(() => {
		if (!params.session_id) {
			setValidPage(false);
		} else {
			FetchManager.fetch({
				url: SESSIONS_URL + params.session_id,
				success_cb: (res) => {
					const response = {
						...res.body,
						healthProfessionalType: res.body?.healthProfessionalType?.name ?? "N/a",
						healthProfessional: res.body?.healthProfessional?.name ?? "N/a",
						patient: res.body?.patient?.name ?? "N/a",
						date: new Date(res.body.timestamp).toLocaleDateString(),
						time: new Date(res.body.timestamp).toLocaleTimeString()
					}
					setLoading(false)
					setSession(response);
				}
			})
		}
		//eslint-disable-next-line
	}, []);
	return (
		<Layout navList={NavListItems} page={`Session with ${session.healthProfessional ?? '...'}`} openDrawer={false}>
			<Box component={"main"}>
				<Box component={"section"}>
					{validPage ?
						<Grid container spacing={2}>
							<Grid item xs={12} md={6} lg={7} xl={8}>
								<Meeting roomName={params.session_id} userName={session.patient} />
							</Grid>
							<Grid item xs={12} md={6} lg={5} xl={4} sx={{ maxWidth: "800px" }}>
								{loading ?
									<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
										<CircularProgress sx={{ width: "100px", height: "100px" }} />
									</Box>
									:
									<Box>
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
												{subPage === 1 && <Prescription sessionId={session._id} layout={"landscape"} />}
											</Box>
										</Paper>
									</Box>
								}
							</Grid>
						</Grid>
						:
						<NotFoundPage />
					}
				</Box>
			</Box>
		</Layout>
	);
}

export default SessionPage;
