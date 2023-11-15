import { useEffect, useState } from 'react';
import { Box, IconButton, Modal } from '@mui/material';
import DataTable from '../../../../../components/DataTable/DataTable';
import { Edit as EditIcon, Close as CloseIcon, Delete } from '@mui/icons-material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { UrlHelper } from '../../../../../utils/UrlHelper';
import FetchManager from '../../../../../utils/FetchManager';
import LoadingCircle from '../../../../../components/LoadingCircle';
import AddHealthProfessionalType from './AddHealthProfessionalType';
import EditHealthProfessionalType from './EditHealthProfessionalType';
import ModalButton from '../../../../../components/Modal/ModalButton';
import DeleteHealthProfessionalType from './DeleteHealthProfessionalType';

const HealthProfessionalTypes_URL = UrlHelper.createApiUrlPath("/api/healthProfessionalTypes");

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
const HealthProfessionalTypes = () => {
	const [session, setSessions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
	const [reload, setReload] = useState(false);

	const handleModalClose = () => {
		setReload(!reload);
		setOpenModal(false);
	}

	const deleteHealthProfessionalType = (params) => {
		return () => {
			setModalContent("delete");
			setOpenModal(true);
			setActionRow(params.row)
		}
	}

	const editeHealthProfessionalType = (params) => {
		return () => {
			setModalContent("edit");
			setOpenModal(true);
			setActionRow(params.row)
		}
	}

	const headCells = [
		{ field: 'name', headerName: 'Name', width: 200 },
		{ field: 'description', headerName: 'Description', width: 500 },
		{
			field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
			getActions: (params) => [
				<GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={editeHealthProfessionalType(params)} key={params.id} showInMenu />,
				<GridActionsCellItem icon={<Delete />} label="Delete" onClick={deleteHealthProfessionalType(params)} key={params.id} showInMenu />,
			],
		},
	];

	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: HealthProfessionalTypes_URL,
			success_cb: (res) => {
				setSessions(res.body);
				setLoading(false)
			}
		})
	}, [reload]);
	return (
		<Box sx={{ paddingY: "1em", paddingX: "1em" }}>
			<Box>
				<Box component={"section"} sx={{ display: "flex", justifyContent: "flex-start", marginBottom: 1 }}>
					<ModalButton title="Add a health professional type" text={"Add New"} onClose={handleModalClose}>
						<AddHealthProfessionalType onClose={handleModalClose} />
					</ModalButton>
				</Box>
				<Box component={"section"}>
					{loading ?
						<LoadingCircle />
						: <DataTable title={"Events"} columns={headCells} rows={session} pageSize={10} />
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
						{modalContent === "edit" && <EditHealthProfessionalType HealthProfessionalType={actionRow }/>}
						{modalContent === "delete" && <DeleteHealthProfessionalType healthProfessionalType={actionRow} onClose={handleModalClose}/>}
					</Box>
				</Box>
			</Modal>
		</Box>
	);
}

export default HealthProfessionalTypes;
