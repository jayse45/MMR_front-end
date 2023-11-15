import { useState, useEffect } from 'react';
import {
	Box, Accordion, AccordionDetails,
	AccordionSummary, Typography, Grid
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import styles from "./AddExerciseForm.scss";
import 'mui-player/dist/mui-player.min.css'
import MuiPlayer from 'mui-player'

const ViewExercise = ({ exercise}) => {
	const [expanded, setExpanded] = useState("panel1");

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};
	useEffect(() => {
		new MuiPlayer({
			container: '#mui-player',
			title: exercise.title,
			src: exercise.video.url,
			lang: "en"
		})
	}, [exercise]);

	return (
		<Box sx={{ minWidth: "500px", width: "60vw", minHeight: "300px" }}>
			<Typography variant='h5' >{exercise.title}</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} lg={3} xl={3} >
					<Box className={styles.formInput} sx={{ marginTop: 2 }}>
						<Typography component={'p'}>{exercise.description}</Typography>
					</Box>
				</Grid>
				<Grid item xs={12} lg={9} xl={9} >
					<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1bh-content"
							id="panel1bh-header"
						>
							<Typography sx={{ width: '33%', flexShrink: 0 }}>
								Image Description
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Box component="img" sx={{ width: "100%" }} src={exercise.image.url} alt="description" />
						</AccordionDetails>
					</Accordion>
					<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1bh-content"
							id="panel1bh-header"
						>
							<Typography sx={{ width: '33%', flexShrink: 0 }}>
								Video
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Box component={"video"} controls sx={{ width: "100%", maxHeight: "500px", objectFit: "scale-down" }} src={exercise.video.url} />
						</AccordionDetails>
					</Accordion>
					<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1bh-content"
							id="panel1bh-header"
						>
							<Typography sx={{ width: '33%', flexShrink: 0 }}>
								Audio Commentary
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<audio src={exercise.audio.url} controls>
								<i>Your browser does not support the</i>
							</audio>
						</AccordionDetails>
					</Accordion>
				</Grid>
			</Grid>
		</Box>
	);
}

export default ViewExercise;
