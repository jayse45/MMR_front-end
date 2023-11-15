import { Fragment } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
	Dashboard as DashboardIcon,
	AccountBox as AccountBoxIcon,
	Payment as PaymentIcon,
	Person as PersonIcon,
} from '@mui/icons-material';
const NavListItems = (
	<Fragment>
		<ListItemButton href="/">
			<ListItemIcon>
				<DashboardIcon />
			</ListItemIcon>
			<ListItemText primary="Dashboard" />
		</ListItemButton>
		<ListItemButton href="/health_professional">
			<ListItemIcon>
				<PersonIcon />
			</ListItemIcon>
			<ListItemText primary="Health Professionals" />
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