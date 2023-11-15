import { createTheme } from '@mui/material/styles';

// Create a theme instance.
export const theme = createTheme({
	palette: {
		primary: {
			main: "#0474E8"
		},
		secondary: {
			main: "#EE8C1B",

		},
		lemon: {
			main: "#D1E972",
		},

		white: {
			main: "#ffffee",
		},

		danger: {
			main: "#f00",
		}
	},
	spacing: (factor) => `${0.5 * factor }rem`,
	typography:{
		body3: {
			fontFamily: '"Helvetica", "Arial", sans-serif',
			fontWeight: 200,
			fontSize: "0.8rem",
			lineHeight: "",
			letterSpacing: "0.1071em",
		}
	}
});