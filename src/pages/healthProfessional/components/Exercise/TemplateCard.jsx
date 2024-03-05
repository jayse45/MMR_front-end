import { Box, Button, Divider, FormControl, Grid, MenuItem, Pagination, Select, TextField, Typography, Card, Chip, Skeleton } from "@mui/material";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import { spacing } from '@mui/system';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';



const TemplateCard = () =>{

    
	// TODO remove, this demo shouldn't need to reset the theme.
    const defaultTheme = createTheme();


  
    const cards = [1, 2, 3, 4, 5, 6];

    return(
        <ThemeProvider theme={defaultTheme}>
      				<CssBaseline />
      
      		<main>
        {/* Hero unit */}

		
        
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: '56.25%',
                    }}
                    image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {}
                    </Typography>
					<Container disableGutters sx={{display: 'flex', flexDirection: 'row' }}>
						<Container disableGutters sx={{display:'flex', flexDirection:'row', justifyContent:'flex-end' }}>
							<Typography sx={{fontSize:'12px'}}>
								{}
							</Typography>

						</Container>
						
						<Container disableGutters sx={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>

						<Typography sx={{fontSize:'13px'}}>
							18 mins
						</Typography>
						<Typography sx={{fontSize:'11px'}}>
							Time hi
						</Typography>

						</Container>
						
					</Container>
                    
                  </CardContent>
                  <CardActions>
                    <Button size="small">Edit Template</Button>
                    <Button size="small">Prescribe</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      
    			</ThemeProvider>

    )

};

export default TemplateCard;














