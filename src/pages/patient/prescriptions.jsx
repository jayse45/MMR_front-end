import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box, Container, Typography } from '@mui/material';
import NavListItems from './components/NavListItems';
import styles from "./Patient.scss";


import PrescriptionCard from './components/PrescriptionCards';


const Prescriptions = () => {

    return(
        <Layout navList={NavListItems} restricted={false} page={"prescription"}>
			<Box component={"main"} className={styles.main} >
				<Box component={"section"}>
                <Container>
						<Typography gutterBottom variant="h5" component="h2">
                            Prescribed Exercises
						</Typography>

			</Container>

                <Container>
						<Typography gutterBottom variant="h6" component="h3">
						    Current Exercises 
						</Typography>

			</Container>
					
						<PrescriptionCard />
					
				</Box>
				<Box component={"section"} sx={{ marginTop: 2 }}>
                
                

                <Container>
						<Typography gutterBottom variant="h6" component="h3">
						    Older Exercises 
						</Typography>

			</Container>
					
						<PrescriptionCard />
					
				
					
				</Box>
			</Box>
		</Layout>
    );
}

export default Prescriptions;