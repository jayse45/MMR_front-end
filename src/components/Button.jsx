import { CircularProgress, Button as MUIBUtton } from '@mui/material';
const Button = ({ children, href="", fullWidth=false, title="button", onClick, type = "", variant = "contained", disabled = false, loading = false }) => {
	const styles = {
		minWidth: "100px",
		color: variant === "contained" ? "#f1f1f1" : "#0474E8",
		backgroundColor: variant === "contained" ? "#0474E8	" : "#fcfcfc",
		border: variant === "outlined" ? "1px solid #0474E8" : "none",
		borderRadius: "1em",
		"&:hover": {
			backgroundColor: variant === "contained" ? "#0474E8dd" : "#0474E8",
			color: variant === "contained" ? "#fcfcfc" : "#f1f1f1",
			border: "none",
			outline: "1px solid #0474E8dd",
			outlineOffset: "1px",
		},
		"&.MuiButtonBase-root:disabled": {
			color: "#000000a6",
			boxShadow: "none",
			backgroundColor: "#ededed1f",
		}
	}

	return (
		<MUIBUtton href={href} title={title} fullWidth={fullWidth} variant={variant} type={type} onClick={onClick} sx={styles} disabled={disabled}>
			{loading ? <CircularProgress size={25} sx={{ color: "#0474E8" }} /> : children}
		</MUIBUtton>
	);
}

export default Button;
