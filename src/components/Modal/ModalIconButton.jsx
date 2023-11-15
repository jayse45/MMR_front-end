import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styles from "./Index.module.scss";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useAuth from "../../hooks/useAuth";

export default function ModalIconButton({ children, icon, title,
	onClose = () => {/*empty to prevent null calls*/ },
	onReady = () => {/* empty to prevent null calls */ },
	sx={}
}) {
	const { openModalButton, setOpenModalButton } = useAuth();
	const handleOpen = () => setOpenModalButton(true);
	const handleClose = () => {
		setOpenModalButton(false);
		onClose();
	}
	React.useEffect(() => {
		onReady();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Box>
			<IconButton sx={{...sx}} title={title} onClick={handleOpen}>{icon}</IconButton>
			<Modal
				open={openModalButton}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<Box className={styles.Modal}>
					<Box className={styles.CloseButton}>
						<IconButton onClick={handleClose} sx={{ color: 'white' }}>
							<CloseIcon />
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
