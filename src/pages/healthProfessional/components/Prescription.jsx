import { Box, Checkbox, FormControlLabel, Grid, Paper, Skeleton, Typography } from "@mui/material";
import PrescriptionInstruction from "./PrescriptionInstruction";
import { useState, useEffect } from "react";
import { UrlHelper } from '../../../utils/UrlHelper';
import FetchManager from "../../../utils/FetchManager";
import TrackExerciseCard from "./TrackExerciseCard";
import VisibilityIcon from '@mui/icons-material/Visibility';

const SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/users/");

const Prescription = ({ sessionId, layout }) => {
	const [prescriptions, setPrescriptions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		FetchManager.fetch({
			url: `${SESSIONS_URL}${sessionId}/exercises`,
			success_cb: (res) => {
				setPrescriptions(res.body);
			},
			prefetch_cb: () => { setLoading(true) },
			postfetch_cb: () => { setLoading(false) }
		})
	}, [sessionId])

	return (<Box className="SessionArea mt-1">
		<Grid container spacing={1} className="main-content">
			<Box pl={3}>
				<FormControlLabel label={<Typography variant="caption">Not viewed by patient</Typography>} control={<Checkbox size="small" onChange={() => { }} color="default" checked={false} />} />
				<FormControlLabel label={<Typography variant="caption">Viewed by patient</Typography>} control={<Checkbox size="small" onChange={() => { }} color="default" checkedIcon={<VisibilityIcon />} checked />} />
				<FormControlLabel label={<Typography variant="caption">Completed by patient</Typography>} control={<Checkbox size="small" onChange={() => { }} color="success" checked />} />
			</Box>
			{loading && <Skeleton variant="rectagular" animation="wave" width={"100%"} height={"240px"} />}
			{!loading && prescriptions.length === 0 &&
				<Paper sx={{ p: 3 }}>
					<Typography>You do not have any prescriptions for this session yet.</Typography>
				</Paper>
			}
			{!loading && prescriptions.map(prescription => {
				return (<Paper key={prescription.exercise._id} sx={{ p: 3 }}>
					<Grid container spacing={1} className="mb-3">
						<Grid item xs={12} sm={12} md={layout === "landscape" ? 6 : 12} xl={layout === "landscape" ? 6 : 12}>
							<TrackExerciseCard prescription={prescription} exercise={prescription.exercise} />
						</Grid>
						<Grid item xs={12} sm={12} md={layout === "landscape" ? 6 : 12} xl={layout === "landscape" ? 6 : 12}>
							<PrescriptionInstruction prescription={prescription} />
						</Grid>
					</Grid>
				</Paper>)
			}
			)}
		</Grid>
	</Box>)
}

export default Prescription;