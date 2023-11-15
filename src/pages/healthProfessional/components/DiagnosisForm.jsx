import { useState } from 'react';
import { Box,Grid, TextField, FormControl, FormHelperText } from '@mui/material';
import FetchManager from '../../../utils/FetchManager';
import NotificationManager from '../../../utils/NotificationManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import Button from '../../../components/Button';

const DiagnosisForm = ({ session, reload }) => {
	const SESSION_ADD_DIAGNOSIS_URL = UrlHelper.createApiUrlPath(`/api/sessions/users/${session._id}/diagnosis`);
	const [formValue, setFormValues] = useState({
		"PC": session?.diagnosis?.PC ?? "",
		"HPC": session?.diagnosis?.HPC ?? "",
		"PMHx": session?.diagnosis?.PMHx ?? "",
		"FSHx": session?.diagnosis?.FSHx ?? "",
		"OE": session?.diagnosis?.OE ?? "",
		"DHx": session?.diagnosis?.DHx ?? "",
		"investigation": session?.diagnosis?.investigation ?? "",
		"physicalDiagnosis": session?.diagnosis?.physicalDiagnosis ?? "",
		"plan": session?.diagnosis?.plan ?? "",
		"note": session?.diagnosis?.note ?? "",
		"recommendation": session?.diagnosis?.recommendation ?? "",
	})

	const saveDiagnosis = () => {
		FetchManager.fetch({
			url: SESSION_ADD_DIAGNOSIS_URL,
			method: "PUT",
			body: formValue,
			success_cb: (res) => {
				if (res.status) {
					NotificationManager.notifyUser({
						type: 'success',
						message: 'Diagnosis saved successfully',
					})
					reload();
				} else {
					NotificationManager.notifyUser({
						type: 'error',
						title: 'Failed to save diagnosis.',
					})
				}
			}
		})
	}

	const onFormValueChange = (evt) => {
		setFormValues({
			...formValue,
			[evt.target.name]: evt.target.value,
		})
	}
	
	return (
		<Box sx={{ padding: 2 }} className="SessionArea">
			<Grid container justifyContent="center" alignItems="center" direction="row" spacing={1} className="mb-1">
				<Grid item xs={12} lg={12} xl={12}>
					<Box sx={{ padding: 2 }}>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='PC' label='PC' fullWidth variant={"outlined"} name='PC' multiline rows={3} value={formValue.PC} onChange={onFormValueChange} />
							<FormHelperText id="PC-helper-text">Presenting Complaint.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='HPC' label='HPC' fullWidth variant={"outlined"} name='HPC' multiline rows={3} value={formValue.HPC} onChange={onFormValueChange} />
							<FormHelperText id="HPC-helper-text">History of Presenting Complaint.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='PMHx' label='PMHx' fullWidth variant={"outlined"} name='PMHx' multiline rows={3} value={formValue.PMHx} onChange={onFormValueChange} />
							<FormHelperText id="PMHx-helper-text">Past Medical History.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='DHx' label='DHx' fullWidth variant={"outlined"} name='DHx' multiline rows={3} value={formValue.DHx} onChange={onFormValueChange} />
							<FormHelperText id="DHx-helper-text">Drug History.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='FSHx' label='FSHx' fullWidth variant={"outlined"} name='FSHx' multiline rows={3} value={formValue.FSHx} onChange={onFormValueChange} />
							<FormHelperText id="FSHx-helper-text">Family and Social History.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='OE' label='OE' fullWidth variant={"outlined"} name='OE' multiline rows={3} value={formValue.OE} onChange={onFormValueChange} />
							<FormHelperText id="OE-helper-text">Observation and Examination.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='investigation' label='investigation' fullWidth variant={"outlined"} name='investigation' multiline rows={3} value={formValue.investigation} onChange={onFormValueChange} />
							<FormHelperText id="investigation-helper-text">Investigation.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='physicalDiagnosis' label='physicalDiagnosis' fullWidth variant={"outlined"} name='physicalDiagnosis' multiline rows={3} value={formValue.physicalDiagnosis} onChange={onFormValueChange} />
							<FormHelperText id="physicalDiagnosis-helper-text">Physical Diagnosis.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='plan' label='plan' fullWidth variant={"outlined"} name='plan' multiline rows={3} value={formValue.plan} onChange={onFormValueChange} />
							<FormHelperText id="plan-helper-text">Enter Plan.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='note' label='note' fullWidth variant={"outlined"} name='note' multiline rows={3} value={formValue.note} onChange={onFormValueChange} />
							<FormHelperText id="note-helper-text">Enter Note.</FormHelperText>
						</FormControl>
						<FormControl sx={{ marginBottom: 2 }} fullWidth>
							<TextField id='recommendation' label='recommendation' fullWidth variant={"outlined"} name='recommendation' multiline rows={3} value={formValue.recommendation} onChange={onFormValueChange} />
							<FormHelperText id="recommendation-helper-text">Enter Recommendation.</FormHelperText>
						</FormControl>
						<Button onClick={saveDiagnosis}>Save</Button>
					</Box>
				</Grid>
			</Grid>


		</Box>
	)
}


export default DiagnosisForm;