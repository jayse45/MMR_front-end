import { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Menu as MenuIcon, Logout as LogoutIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';
import { Box, IconButton, Divider, Toolbar, List, Typography, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import Copyright from '../Copyright/Copyright';
import useAuth from "../../hooks/useAuth";
import AppBar from './AppBar';
import Drawer from './Drawer';
import { useNavigate, useLocation } from "react-router-dom";
import './Layout.scss';
import SubscriptionManager from '../../utils/SubscriptionManager';
import SubscriptionsBlocker from '../Subscriptions/SubscriptionsBlocker';
import LoadingCircle from '../LoadingCircle';
import NavigationAvatar from './NavigationAvatar';


const mdTheme = createTheme();

export default function Layout({ children, navList, restricted = true, page, openDrawer = true }) {
	const navigate = useNavigate();
	const { signOut, getUser } = useAuth();
	const [open, setOpen] = useState(openDrawer);
	const [isLoading, setIsloading] = useState(true);
	const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(true);
	let pageTitle = useLocation().pathname.substring(1).toLocaleUpperCase().replace("_", " ");
	if (page) {
		pageTitle = page;
	}
	const toggleDrawer = () => {
		setOpen(!open);
	};
	const logout = () => {
		signOut((user) => {
			if (user && user.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/login");
			}
		})
	}

	const validiteState = async () => {
		const user = getUser();
		if (user?.creator?.type === "admin") {
			setIsSubscriptionExpired(false);
			setIsloading(false);
		} else {
			const result = await SubscriptionManager.isUserSubscriptionExpired();
			setIsloading(false);
			setIsSubscriptionExpired(result);
			let title = pageTitle.toLowerCase();

			if (title) {
				title = title[0].toUpperCase() + title.substring(1);
			}
			document.title = `MMR: ${title}` ?? "MonitorMyRehab";
		}
	}

	useEffect(() => {
		validiteState();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ThemeProvider theme={mdTheme}>
			<Box sx={{ display: 'flex' }}>
				<CssBaseline />
				<AppBar position="absolute" open={open}>
					<Toolbar
						sx={{
							pr: '24px', // keep right padding when drawer closed
						}}
					>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							title="expand"
							onClick={toggleDrawer}
							sx={{
								marginRight: '36px',
								...(open && { display: 'none' }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							sx={{ flexGrow: 1 }}
						>
							{pageTitle ?? "Dashboard"}
						</Typography>
						<NavigationAvatar logout={logout} />
					</Toolbar>
				</AppBar>
				<Drawer variant="permanent" open={open}>
					<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
						<Box sx={{ marginLeft: 8, paddingTop: 1 }}>
							<img className='drawer-logo-img' alt="logo" src={"/logo192.png"} />
						</Box>
						<Toolbar
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-end',
								px: [1],
							}}
						>
							<IconButton title="collapse" onClick={toggleDrawer}>
								<ChevronLeftIcon />
							</IconButton>
						</Toolbar>
					</Box>

					<Divider />
					<List component="nav" sx={{ ".MuiListItemIcon-root": { "minWidth": "33px!important" } }}>
						{navList}
						<Divider sx={{ my: 1 }} />
						<ListItemButton onClick={logout}>
							<ListItemIcon>
								<LogoutIcon />
							</ListItemIcon>
							<ListItemText primary="Logout" />
						</ListItemButton>
					</List>
				</Drawer>

				<Box component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === 'light'
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						minHeight: '90vh',
					}}
				>
					<Toolbar />
					<Box sx={{ mb: 2, p: 1, minHeight: "80vh" }}>
						{isLoading && <LoadingCircle />}
						{!isLoading && isSubscriptionExpired && restricted && <SubscriptionsBlocker />}
						{!isLoading && (!isSubscriptionExpired || !restricted) && children}
					</Box>
					<Box sx={{ marginTop: 1, display: "flex", justifyContent: "center", alignItems: "center", alignContent: "center" }}>
						<Copyright sx={{ pt: 4 }} />
					</Box>
				</Box>
			</Box>
		</ThemeProvider>
	);
}