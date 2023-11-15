import { Fragment } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
	CalendarMonth as CalendarMonthIcon,
	Dashboard as DashboardIcon,
	AccountBox as AccountBoxIcon,
	Payment as PaymentIcon,
	People as PeopleIcon,
	PeopleAlt as PeopleAltIcon,
	QuestionAnswer as QuestionAnswerIcon,
	FitnessCenter as FitnessCenterIcon,
	Loyalty as LoyaltyIcon,
	Approval as ApprovalIcon,
	Settings,
	Inventory
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
		<ListItemButton href="/sessions">
			<ListItemIcon>
				<QuestionAnswerIcon />
			</ListItemIcon>
			<ListItemText primary="Sessions" />
		</ListItemButton>
		<ListItemButton href="/approvals">
			<ListItemIcon>
				<ApprovalIcon />
			</ListItemIcon>
			<ListItemText primary="Approvals" />
		</ListItemButton>
		<ListItemButton href="/users">
			<ListItemIcon>
				<PeopleIcon />
			</ListItemIcon>
			<ListItemText primary="Users" />
		</ListItemButton>
		<ListItemButton href="/admins">
			<ListItemIcon>
				<PeopleAltIcon />
			</ListItemIcon>
			<ListItemText primary="Admins" />
		</ListItemButton>
		<ListItemButton href="/exercises">
			<ListItemIcon>
				<FitnessCenterIcon />
			</ListItemIcon>
			<ListItemText primary="Exercises" />
		</ListItemButton>
		<ListItemButton href="/payments">
			<ListItemIcon>
				<PaymentIcon />
			</ListItemIcon>
			<ListItemText primary="Payments" />
		</ListItemButton>
		<ListItemButton href="/subscriptions">
			<ListItemIcon>
				<LoyaltyIcon />
			</ListItemIcon>
			<ListItemText primary="Subscriptions" />
		</ListItemButton>
		<ListItemButton href="/subscriptionPackages">
			<ListItemIcon>
				<Inventory />
			</ListItemIcon>
			<ListItemText primary="Packages" />
		</ListItemButton>
		<ListItemButton href="/profile">
			<ListItemIcon>
				<AccountBoxIcon />
			</ListItemIcon>
			<ListItemText primary="Profile" />
		</ListItemButton>
		<ListItemButton href="/settings">
			<ListItemIcon>
				<Settings />
			</ListItemIcon>
			<ListItemText primary="Settings" />
		</ListItemButton>
	</Fragment>
);

export default NavListItems;