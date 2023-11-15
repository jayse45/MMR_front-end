import { Card, CardContent, CardActionArea, Typography } from '@mui/material';
import NumbersIcon from '@mui/icons-material/Numbers';
import Skeleton from '@mui/material/Skeleton';
import styles from "./Dashboard.scss"
import { useNavigate } from "react-router-dom";

export default function DashboardCard({ number = "", text, Icon = <NumbersIcon />, link = "#" }) {
	const navigate = useNavigate();
	const openLink = () => {
		
		navigate(link);
	}
	return (
		<Card raised className={styles.Card} sx={{ minWidth: 200 }}>
			{number === "" &&
				<Skeleton variant="rectangular" width={"100%"} height={120} />
			}
			{number !== "" &&
				<CardActionArea onClick={openLink}>
					<CardContent>
						<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
							{number}
						</Typography>
						{Icon}
						<Typography variant="body2" sx={{ textTransform: "capitalize" }}>
							{text}
						</Typography>
					</CardContent>
				</CardActionArea>
			}
		</Card>
	);
}
