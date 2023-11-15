import { Box, Grid, TextField, FormControl } from '@mui/material';
import { useEffect, useState } from 'react';
import FetchManager from '../../utils/FetchManager';
import { UrlHelper } from '../../utils/UrlHelper';

const SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/users/");

const Diagnosis = ({ sessionId }) => {
	const [diagnosisData, setDiagnosisData] = useState({
		"PC": "N/A",
		"HPC": "N/A",
		"PMHx": "N/A",
		"FSHx": "N/A",
		"OE": "N/A",
		"DHx": "N/A",
		"investigation": "N/A",
		"physicalDiagnosis": "N/A",
		"plan": "N/A",
		"note": "N/A",
		"recommendation": "N/A",
	})

	useEffect(() => {
		FetchManager.fetch({
			url: `${SESSIONS_URL}${sessionId}/diagnosis`,
			success_cb: (res) => {
				if (res.body.diagnosis) {
					setDiagnosisData(res.body.diagnosis);
				}
			}
		})
	}, [sessionId])

	return (
		<Box sx={{ padding: 2 }} className="SessionArea mt-1">
			<Grid container justifyContent="center" alignItems="center" direction="row" spacing={1} className="mb-1">
				<Grid item xs={12} lg={12} xl={12}>
					<Box sx={{ paddingX: 1 }}>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField disabled id='physicalDiagnosis' label="Health Professional's Diagnosis" fullWidth variant={"filled"} name='physicalDiagnosis' multiline rows={3} value={diagnosisData.physicalDiagnosis} />
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField disabled id='plan' label='Plan' fullWidth variant={"filled"} name='plan' multiline rows={3} value={diagnosisData.plan} />
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField disabled id='recommendation' label='Recommendation' fullWidth variant={"filled"} name='recommendation' multiline rows={3} value={diagnosisData.recommendation} />
						</FormControl>
					</Box>
				</Grid>
			</Grid>
		</Box>
	)
}


export default Diagnosis;