import { Grid, TextField } from '@mui/material';

const PrescriptionInstruction = ({prescription}) => {
	return (
		<Grid item xs={12} lg={12} className="border rounded mb-1">
			<Grid container direction="row" spacing={1} rowSpacing={2}>
				<Grid item xs={6} lg={6}>
					<TextField
						id="sets"
						label="Sets"
						size="small"
						variant="outlined"
						name="sets"
						disabled
						value={prescription.sets}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
				<Grid item xs={6} lg={6}>
					<TextField
						id="reps"
						size="small"
						label="Reps"
						name="reps"
						variant="outlined"
						min="0"
						disabled
						value={prescription.reps}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
				<Grid item xs={6} lg={6}>
					<TextField
						id="time"
						variant="outlined"
						size="small"
						label="Time(min)"
						disabled
						name="time"
						value={prescription.time}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
				<Grid item xs={6} lg={6}>
					<TextField
						id="distance"
						label="Distance(m)"
						size="small"
						disabled
						name="distance"
						value={prescription.distance}
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
				<Grid item xs={6} lg={6}>
					<TextField
						id="intensity"
						variant="outlined"
						label="Intensity"
						size="small"
						type="text"
						disabled
						name="intensity"
						value={prescription.intensity}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
				<Grid item xs={12} lg={12}>
					<TextField
						fullWidth
						name="note"
						label="Note"
						size="small"
						multiline
						disabled
						rows={2}
						value={prescription.note}
						aria-label="Note"
						variant="outlined"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</Grid>
			</Grid>

		</Grid>
	);
}

export default PrescriptionInstruction;
