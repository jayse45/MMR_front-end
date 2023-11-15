import { Box, Modal } from '@mui/material';
import styles from "./Index.module.scss";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useAuth from "../../hooks/useAuth";

export default function CustomModal({ children, onClose = ()=>{}, startModalOpen}) {
	const { setOpenModal } = useAuth();
	let { openModal } = useAuth();
	openModal = startModalOpen ?? openModal;
	
	const handleClose = () => { 
		setOpenModal(false); 
		onClose();
	}
	
	return (
		<Box sx={{ marginBottom: "-10px", backdropFilter: "blur(8px)"}}>
			<Modal
				open={openModal}
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
