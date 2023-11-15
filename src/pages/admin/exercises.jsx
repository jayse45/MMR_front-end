import { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Box, Divider, FormControl, Grid, MenuItem, Pagination, Select, TextField, Typography } from '@mui/material';
import NavListItems from './components/NavListItems';
import styles from "./Admin.scss";
import { UrlHelper } from '../../utils/UrlHelper';
import FetchManager from '../../utils/FetchManager';

import LoadingCircle from '../../components/LoadingCircle';
import AddExerciseForm from '../../components/Exercise/AddExerciseForm';
import ViewExercise from '../../components/Exercise/ViewExercise';
import DeleteExerciseForm from '../../components/Exercise/DeleteExerciseForm';
import EditExerciseForm from '../../components/Exercise/EditExerciseForm';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import CustomModal from '../../components/Modal/CustomModal';
import ViewExerciseCard from '../../components/Exercise/ViewExerciseCard';

const EXERCISES_URL = UrlHelper.createApiUrlPath("/api/exercises/paginate?");
const BODY_PARTS_URL = UrlHelper.createApiUrlPath("/api/bodyParts");

const ExercisePage = () => {
	const [exercises, setExercises] = useState([]);
	const [bodyParts, setBodyParts] = useState([]);
	const [bodyPart, setBodyPart] = useState("");
	const [loading, setLoading] = useState(false);
	const [reload, setReload] = useState(false);
	const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
	const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");
	const [pageCount, setPageCount] = useState(1);
	const limit = 10;
	const { setOpenModal } = useAuth();

	const handleModalClose = () => {
		setOpenModal(false);
		setReload(!reload);
	}

	const deleteExercise = (exercise) => {
		return () => {
			setModalContent("delete");
			setOpenModal(true);
			setActionRow(exercise)
		}
	}

	const editExercise = (exercise) => {
		return () => {
			setModalContent("edit");
			setOpenModal(true);
			setActionRow(exercise)
		}
	}
	const addExercise = () => {
		setModalContent("add");
		setOpenModal(true);
	}

	const handlePageChange = (event, value) => {
		setPage(value);
	};
	const handleSearchChange = (evt) => {
		setQuery(evt.target.value)
	}

	const handleBodyPartChange = (evt) => {
		setBodyPart(evt.target.value);
	}

	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: `${EXERCISES_URL}page=${page - 1}&limit=${limit}&query=${query}&bodyPart=${bodyPart}`,
			success_cb: (res) => {
				setExercises(res.body);
				setPageCount(res.pagination.pages)
				setLoading(false);
			}
		})
	}, [reload, limit, page, query, bodyPart]);

	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: BODY_PARTS_URL,
			success_cb: (res) => {
				setBodyParts(res.body);
				setLoading(false);
			}
		})
	}, [])
	return (
		<Layout navList={NavListItems}>
			<Box component={"main"} className={styles.main} >
				<Box component={"section"} sx={{ display: "flex", justifyContent: "space-between" }} mb={1}>
					<Grid container rowSpacing={1} spacing={2}>
						<Grid item xs={12} sm={6} md={5} lg={5}>
							<Typography mr={1} variant="subtitle2">Search: </Typography>
							<TextField fullWidth size='small' id="search" onChange={handleSearchChange} label="search" variant="outlined" />
						</Grid>
						<Grid item xs={12} sm={3} md={4} lg={5}>
							<Typography mr={1} variant="subtitle2">Body Part: </Typography>
							<FormControl variant="standard" fullWidth sx={{ minWidth: "150px" }}>
								<Select
									size={"small"}
									variant='outlined'
									disabled={loading}
									displayEmpty
									inputProps={{ 'aria-label': 'Without label' }}
									onChange={handleBodyPartChange}
									value={bodyPart}
								>
									<MenuItem key={0} value={""} selected>ALL</MenuItem>
									{bodyParts.map(item => (<MenuItem key={item._id} value={item._id}>{item.name.toLocaleUpperCase()}</MenuItem>))}
								</Select>
							</FormControl> 
						</Grid>
						<Grid item xs={12} md={3} sm={3} lg={2} display={"flex"} justifyContent={"flex-start"} alignItems={"flex-end"}>
							<Button sx={{ height: "1.2em" }} onClick={addExercise}>Add Exercise</Button>
						</Grid>
					</Grid>
				</Box>
				<Divider />
				<Box component={"section"} sx={{ marginTop: 1, minHeight: "70vh" }}>
					{loading ?
						<LoadingCircle />
						: <Grid container spacing={2} >
							{exercises.map(exercise => (
								<Grid key={exercise._id} item xl={2} lg={3} md={4} sm={4} xs={6}>
									<ViewExerciseCard modify exercise={exercise} editAction={editExercise(exercise)} deleteAction={deleteExercise(exercise)} />
								</Grid>
							))}
						</Grid>
					}
				</Box>
				<Box mt={2}>
					<Pagination count={pageCount} size="large" page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
				</Box>
			</Box>
			<Box>
				
			</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "edit" && <EditExerciseForm exercise={actionRow} success_cb={handleModalClose} />}
				{modalContent === "delete" && <DeleteExerciseForm success_cb={handleModalClose} exercise={actionRow} />}
				{modalContent === "view" && <ViewExercise exercise={actionRow} />}
				{modalContent === "add" && <AddExerciseForm success_cb={handleModalClose} />}
			</CustomModal>
		</Layout>
	);
}

export default ExercisePage;
