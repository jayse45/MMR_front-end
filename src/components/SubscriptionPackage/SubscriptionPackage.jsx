import { Bolt } from '@mui/icons-material';
import { Avatar, Box, Card, Divider, Typography } from '@mui/material';
import parse from 'html-react-parser';
import "../../static/css/animate.min.css";

const SubscriptionPackage = ({ subscriptionPackage }) => {
	return (
		<Card sx={{p: 2}} elevation={5}>
			<Box className="price-table" sx={{ "& div ": {display: 'flex', justifyContent: "center", flexDirection: "row"}}}>
				<Box className="price-text">
					<Typography variant='h5'>{subscriptionPackage.title}</Typography>
				</Box>
				<Box sx={{margin: 1}} className="price-icon">
					<Avatar sx={{ width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#0b6400" }}>
						<Bolt sx={{width: "50px", height: '50px'}}/>
					</Avatar>
					<Box className="price-icon-shape-wrap">
						<Box className="price-icon-shape" />
						<Box className="price-icon-shape" />
					</Box>
				</Box>
				<Divider />
				<Box className="price-value" sx={{display: "flex", alignItems: "baseline"}}>
					<Typography variant='h6'>{subscriptionPackage.currency} </Typography>
					<Typography variant='h5'>{subscriptionPackage.price}</Typography>
					<Typography component='span'>/{subscriptionPackage.duration_text}</Typography>
				</Box>
				<Divider />
				<Box>
					{parse(subscriptionPackage.description)}
				</Box>
			</Box>
		</Card>
	);
}

export default SubscriptionPackage;
