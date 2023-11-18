import { Fragment } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
	CalendarMonth as CalendarMonthIcon,
	Dashboard as DashboardIcon,
	AccountBox as AccountBoxIcon,
	Payment as PaymentIcon,
	HourglassBottom as HourglassBottomIcon,
	QuestionAnswer as QuestionAnswerIcon,
	FitnessCenter as FitnessCenterIcon,
} from '@mui/icons-material';
const NavListItems = (
	<Fragment>
		<ListItemButton href="/">
			<ListItemIcon>
				<DashboardIcon />
			</ListItemIcon>
			<ListItemText primary="Dashboard" />
		</ListItemButton>
		<ListItemButton href="/appointments">
			<ListItemIcon>
				<CalendarMonthIcon />
			</ListItemIcon>
			<ListItemText primary="Appointments" />
		</ListItemButton>
		<ListItemButton href="/prescription">
			<ListItemIcon>
				<FitnessCenterIcon/>
			</ListItemIcon>
			<ListItemText primary="Prescription" />
		</ListItemButton>
		<ListItemButton href="/sessions">
			<ListItemIcon>
				<QuestionAnswerIcon />
			</ListItemIcon>
			<ListItemText primary="Sessions" />
		</ListItemButton>
		<ListItemButton href="/history">
			<ListItemIcon>
				<HourglassBottomIcon />
			</ListItemIcon>
			<ListItemText primary="History" />
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