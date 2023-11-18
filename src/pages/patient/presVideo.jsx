import React, { useState }  from 'react';
import { Container, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton } from '@mui/material';
// You will need to install a video player package, like react-player, to use a video player

import VideoPlayer from '../../components/VideoPlayer';
import Layout from '../../components/Layout/Layout';
import NavListItems from './components/NavListItems';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function CoursePage() {


      // State to track completion percentage (this can be fetched or managed differently in your application)
  const [completionPercentage, setCompletionPercentage] = useState(50); // Change this value to see the check icon color change

  // Function to determine the color of the check icon based on completion percentage
  const getCheckIconColor = () => {
    return completionPercentage >= 80 ? 'success' : 'inherit';
  };

  return (
    <Layout navList={NavListItems} restricted={false} page={"presvideo"}>
        <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Exercise Title
      </Typography>
      <Container maxWidth="md">
        <Grid item xs={8}>
          <Paper elevation={3}>
            {/* Embed the video player */}
            
            <VideoPlayer 
                url="https://www.example.com/your-course-video-url.mp4"
                
            />
          </Paper>
        </Grid>
        
      </Container>
      <Container sx={{marginTop:'15px'}}>
      <Grid item xs={4}>
          <Paper sx={{padding: '16px'}}>
            <Typography variant="h6" gutterBottom>
              Exercise Title
            </Typography>
            <Typography>
              Description of the exercise goes here.
            </Typography>
            {/* Add additional course information */}
            {/* Add course modules, resources, etc. */}
          </Paper>
        </Grid>
      </Container>

            {/* Table displaying video progress */}
            <TableContainer component={Paper} sx={{marginTop:'15px'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Video Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Neck Exercise</TableCell>
              <TableCell>Warm Up</TableCell>
              <TableCell>
                
                  <CheckCircleIcon sx={{ color: '#008000' }} />
                
              </TableCell>
            </TableRow>
            {/* Add more rows as needed */}
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Waist Exercise</TableCell>
              <TableCell>Warm Up</TableCell>
              <TableCell>
                {completionPercentage >= 100 ? (
                  <CheckCircleIcon color={getCheckIconColor()} />
                ) : (
                  <CircularProgress variant="determinate" value={completionPercentage} />
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>

    </Layout>
    
  );
}

export default CoursePage;
