import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from "../Button";
import styles from "./Index.module.scss";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useAuth from "../../hooks/useAuth";

export default function ModalButton({ children, text, title, onClose = ()=>{}}) {
	const { openModalButton, setOpenModalButton } = useAuth();
	const handleOpen = () => setOpenModalButton(true);
	const handleClose = () => { 
		setOpenModalButton(false); 
		onClose();
	}
	
	return (
		<Box>
			<Button title={title} onClick={handleOpen}><Typography variant='button'>{text}</Typography></Button>
			<Modal
				open={openModalButton}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box className={styles.Modal}>
					<Box className={styles.CloseButton}>
						<IconButton onClick={handleClose} sx={{ color: 'white' }}>
							<CloseIcon  />
						</IconButton>
					</Box>
					<Box className={styles.ContentWrapper}>
						{children}
					</Box>
				</Box>
			</Modal>
		</Box>
	);
}
