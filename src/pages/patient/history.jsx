import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box, Grid } from '@mui/material';
import NavListItems from './components/NavListItems';
import styles from "./Patient.scss";
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';
import DataTable from '../../components/DataTable/DataTable';
import PageviewIcon from '@mui/icons-material/Pageview';
import { GridActionsCellItem } from '@mui/x-data-grid';
import LoadingCircle from '../../components/LoadingCircle';
import SessionDetails from './components/SessionDetails';
import CustomModal from '../../components/Modal/CustomModal';
import useAuth from '../../hooks/useAuth';

const PAST_SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/users/past");

const HistoryPage = () => {
	const [sessions, setSessions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [modalSession, setModalSession] = useState();
	const { setOpenModal } = useAuth();

	const handleOpenModal = () => {
		setOpenModal(true);
	}
	const handleModalClose = () => {
		setOpenModal(false);
	}
	const viewSession = (params) => {
		return () => {
			console.log(params.row)
			setModalSession(params.row);
			handleOpenModal()
		}
	}

	const headCells = [{ field: 'healthProfessional', headerName: 'Health Professional', width: 200 },
	{ field: 'type', headerName: 'Type', width: 150 },
	{ field: 'healthProfessionalType', headerName: 'Health Professional Type', width: 200 },
	{ field: 'date', headerName: 'Date', width: 100 },
	{ field: 'time', headerName: 'Time', width: 100 },
	{ field: 'status', headerName: 'Status', width: 100 },
	{
		field: 'actions', headerName: 'Actions', type: 'actions', width: 80,
		getActions: (params) => [
			<GridActionsCellItem icon={<PageviewIcon />} label="View" onClick={viewSession(params)} key={params.id} showInMenu />
		],
	}];
	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: PAST_SESSIONS_URL,
			success_cb: (res) => {
				const rows = res.body.map(row => {
					const healthProfessionalType = row?.healthProfessionalType?.name ?? "";
					const healthProfessional = row?.healthProfessional?.name ?? "";
					return {
						...row, healthProfessionalType, healthProfessional,
						date: new Date(row.timestamp).toLocaleDateString(),
						time: new Date(row.timestamp).toLocaleTimeString()
					}
				})
				setSessions(rows);
				setLoading(false)
			}
		})
	}, []);
	return (
		<Layout navList={NavListItems} page={"session history"}>
			<Box component={"main"} className={styles.main} >
				<Box component={"section"}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={8} lg={12} xl={12}>
							{loading ? <LoadingCircle /> : <DataTable title={"Events"} columns={headCells} rows={sessions} pageSize={10} />}
						</Grid>
					</Grid>
				</Box>
			</Box>
			<CustomModal onClick={handleModalClose}>
				<SessionDetails session={modalSession} />
			</CustomModal>
		</Layout>
	);
}

export default HistoryPage;
