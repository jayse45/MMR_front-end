import { Fragment } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
	Dashboard as DashboardIcon,
	People as PeopleIcon,
	AccountBox as AccountBoxIcon,
	CalendarMonth as CalendarMonthIcon,
	Payment as PaymentIcon,
	QuestionAnswer as QuestionAnswerIcon,
	FitnessCenter as FitnessCenterIcon,
} from '@mui/icons-material';
import AuthenticationManager from '../../../utils/AuthenticationManager';

const NavListItems = (
	<Fragment>
		<ListItemButton href="/">
			<ListItemIcon>
				<DashboardIcon />
			</ListItemIcon>
			<ListItemText primary="Dashboard" />
		</ListItemButton>
		<ListItemButton href="/sessions">
			<ListItemIcon>
				<QuestionAnswerIcon />
			</ListItemIcon>
			<ListItemText primary="Sessions" />
		</ListItemButton>
		{AuthenticationManager.getStoredUser()?.creator?.type === "public" &&
			<ListItemButton href="/appointments">
				<ListItemIcon>
					<CalendarMonthIcon />
				</ListItemIcon>
				<ListItemText primary="Appointments" />
			</ListItemButton>
		}
		<ListItemButton href="/patients">
			<ListItemIcon>
				<PeopleIcon />
			</ListItemIcon>
			<ListItemText primary="Patients" />
		</ListItemButton>
		<ListItemButton href="/templates">
			<ListItemIcon>
				<FitnessCenterIcon/>
			</ListItemIcon>
			<ListItemText primary = "Workout Templates"/>
		</ListItemButton>
		<ListItemButton href="/subscription">
			<ListItemIcon>
				<PaymentIcon />
			</ListItemIcon>
			<ListItemText primary="Subscription" />
		</ListItemButton>
		<ListItemButton href="/profile">
			<ListItemIcon>
				<AccountBoxIcon />
			</ListItemIcon>
			<ListItemText primary="Profile" />
		</ListItemButton>
	</Fragment>
);
export default NavListItems;