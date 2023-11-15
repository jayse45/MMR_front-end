import { useEffect, useState } from 'react';
import { Box, TextField, Pagination, Grid, Skeleton, FormControl, Select, MenuItem } from '@mui/material';
import { UrlHelper } from '../../../../utils/UrlHelper';
import FetchManager from '../../../../utils/FetchManager';
import NotificationManager from '../../../../utils/NotificationManager';
import ExerciseSelector from '../ExerciseSelector';

const EXERCISES_URL = UrlHelper.createApiUrlPath("/api/exercises/paginate?limit=6");
const BODY_PARTS_URL = UrlHelper.createApiUrlPath("/api/bodyParts");

const ExercisePaginate = ({ getSelectedExercises, addToSelectedExercises, removeFromSelectedExercises }) => {
	const [exercises, setExercises] = useState([]);
	const [loading, setLoading] = useState(true);
	const selectedExercises = getSelectedExercises();
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(0);
	const [bodyParts, setBodyParts] = useState([]);
	const [bodyPart, setBodyPart] = useState("");
	const handlePageChange = (event, value) => {
		setPage(value);
	};
	const handleQueryChange = (evt) => {
		setQuery(evt.target.value);
	}

	const isSelected = (id) => {
		for (const exercise of selectedExercises) {
			if (id === exercise._id) {
				return true;
			}
		}
		return false;
	}
	const handleBodyPartChange = (evt) => {
		setBodyPart(evt.target.value);
	}

	useEffect(() => {
		FetchManager.fetch({
			url: `${EXERCISES_URL}&query=${query}&page=${page - 1}&limit=10&bodyPart=${bodyPart}`,
			method: "GET",
			success_cb: (res) => {
				if (res.status === 200) {
					setExercises(res.body);
					setPages(res.pagination.pages)
				} else {
					NotificationManager.notifyUser({ message: "Unknown error occured", type: "error" })
				}
				setLoading(true);
			},
			prefetch_cb: () => {
				setLoading(true);
			},
			postfetch_cb: () => {
				setLoading(false);
			}
		})
	}, [query, page, bodyPart]);

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
		<Box>
			<Box sx={{ margin: "2px 3px", display: "flex", justifyContent: "space-between" }}>
				<Box sx={{ marginTop: 1 }}>
					<TextField size='small' name="query" id="query" label="search" value={query} onChange={handleQueryChange} />
				</Box>
				<Box sx={{ marginTop: 1 }}>
					<FormControl variant="standard" sx={{ minWidth: "100px" }}>
						<Select
							size={"small"}
							variant='outlined'
							sx={{ width: "200px" }}
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
				</Box>
			</Box>
			{loading && <Box sx={{ minHeight: "200px", marginTop: 1 }}>
				<Grid container spacing={2}>
					{[1, 2, 3, 4].map(item => (
						<Grid item xs={12} lg={6} key={item}>
							<Skeleton variant='rectanglar' width={"202px"} height={"220px"} />
						</Grid>
					))}
				</Grid>
			</Box>}
			{!loading && <Box sx={{ minHeight: "50vh", marginTop: 1 }}>
				<Grid container spacing={2}>
					{exercises.map(item => (
						<Grid item xs={12} lg={6} key={item._id}>
							<ExerciseSelector exercise={item} addSelected={addToSelectedExercises}
								removeSelected={removeFromSelectedExercises}
								selected={isSelected(item._id)} />
						</Grid>
					))}
				</Grid>
			</Box>}
			<Box sx={{ marginTop: 1 }}>
				<Pagination count={pages} variant="outlined" shape="rounded" page={page} onChange={handlePageChange} />
			</Box>
		</Box>
	);
}

export default ExercisePaginate;
