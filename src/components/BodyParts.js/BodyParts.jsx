import React, { useEffect, useState, useCallback } from 'react';
import { Box, IconButton, Modal } from '@mui/material';
import DataTable from '../DataTable/DataTable';
import { Edit as EditIcon, Close as CloseIcon, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import LoadingCircle from '../LoadingCircle';
import AddBodyPart from './AddBodyPart';
import EditBodyPart from './EditBodyPart';
import DeleteBodyPart from './DeleteBodyPart';
import Button from '../Button';

const BODY_PARTS_URL = UrlHelper.createApiUrlPath("/api/bodyParts");

const style = {
	modalStyle: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		minWidth: "400px",
		maxWidth: "70vw",
		bgcolor: 'background.paper',
		border: '2px solid #000',
		boxShadow: 24,
		p: 4,
	},
	closeButton: {
		display: "flex",
		background: "#0b6400",
		position: "absolute",
		right: 0,
		top: 0,
		justifyContent: "flex-end",
	},
	contentWrapper: {
		maxHeight: "80vh",
		overflowY: "auto",
		padding: "0em 2rem 2rem 1em",
		marginRight: "1px",
	}
};

const BodyParts = () => {
	const [bodyParts, setBodyParts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState(null);
	const [reload, setReload] = useState(false);

	const handleModalClose = useCallback(() => {
		setReload(prevReload => !prevReload);
		setOpenModal(false);
	}, []);

	const deleteBodyPart = useCallback((params) => () => {
		setModalContent("delete");
		setOpenModal(true);
		setActionRow(params.row);
	}, []);

	const editBodyPart = useCallback((params) => () => {
		setModalContent("edit");
		setOpenModal(true);
		setActionRow(params.row);
	}, []);

	const addBodyPart = useCallback(() => {
		setModalContent("add");
		setOpenModal(true);
	}, []);

	const headCells = [
		{ field: 'name', headerName: 'Name', width: 200 },
		{ field: 'description', headerName: 'Description', width: 500 },
		{
			field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
			getActions: (params) => [
				<GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={editBodyPart(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<Delete />} label="Delete" onClick={deleteBodyPart(params)} key={params.id} showInMenu />,
			],
		},
	];

	useEffect(() => {
		FetchManager.fetch({
			url: BODY_PARTS_URL,
			success_cb(response) {
				setBodyParts(response.body);
				setLoading(false);
			},
			failure_cb() {
				setLoading(false);
			},
			prefetch_cb() {
				setLoading(true);
			}
		});
	}, [reload]);

	return (
		<Box sx={{ paddingY: "1em", paddingX:"1em" }}>
			<Box>
				<Box component={"section"} sx={{ display: "flex", justifyContent: "flex-start", marginBottom: 1 }}>
					<Button title="Add body part" text={"Add New"} onClick={addBodyPart}>Add New</Button>
				</Box>
				<Box component={"section"}>
					{loading ?
						<LoadingCircle />
						: <DataTable title={"Body Parts"} columns={headCells} rows={bodyParts} pageSize={10} />
					}
				</Box>
			</Box>
			<Modal
				open={openModal}
				onClose={handleModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style.modalStyle}>
					<Box sx={style.closeButton}><IconButton onClick={handleModalClose}><CloseIcon /></IconButton></Box>
					<Box sx={style.contentWrapper}>
						{modalContent === "add" && <AddBodyPart onClose={handleModalClose} />}
						{modalContent === "edit" && <EditBodyPart BodyPart={actionRow} />}
						{modalContent === "delete" && <DeleteBodyPart bodyPart={actionRow} onClose={handleModalClose} />}
					</Box>
				</Box>
			</Modal>
		</Box>
	);
}

export default BodyParts;
