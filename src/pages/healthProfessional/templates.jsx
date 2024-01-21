import { Box, Button, Divider, FormControl, Grid, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material"
import { UrlHelper } from "../../utils/UrlHelper";
import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import NavListItems from "../healthProfessional/components/NavListItems";
import LoadingCircle from "../../components/LoadingCircle";
import CustomModal from "../../components/Modal/CustomModal";
import useAuth from "../../hooks/useAuth";
import EditExerciseTemplatesForm from "../../components/ExerciseTemplate/EditExerciseTemplatesForm";
import DeleteExerciseTemplatesForm from "../../components/ExerciseTemplate/DeleteExerciseTemplatesForm";
import ViewExerciseTemplatesForm from "../../components/ExerciseTemplate/ViewExerciseTemplatesForm";
import AddExerciseTemplatesForm from "../../components/ExerciseTemplate/AddExerciseTemplatesForm";
import ViewTemplateCard from "../../components/ExerciseTemplate/ViewTemplateCard";
import { useEffect } from "react";
import FetchManager from "../../utils/FetchManager";
import ExercisePaginate from "./components/Exercise/ExercisePaginate";
import ExercisePrescription from "./components/Exercise/ExercisePrescription";
import Container from '@mui/material/Container';

import TemplateCard from "./components/Exercise/TemplateCard";

const TEMPLATES_URL = UrlHelper.createApiUrlPath("/api/templates/paginate?");
const BODY_PARTS_URL = UrlHelper.createApiUrlPath("/api/bodyParts");

const ExerciseTemplatePage = () => {
	//const elements for getting, adding, deleting and viewing tempaltes using the bodyparts search 
	const [templates, setTemplates] = useState([]);
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
	//const elements for selecting templates 
	const [selectedExercises, setSelectedExercises] = useState([]);
	const [step, setStep] = useState(0);

	//Functions to select exercises
	const getSelectedExercises = () => (selectedExercises)
	const isSelected = (exercises) => {
		for (const temp of selectedExercises) {
			if (exercises._id === temp._id) {
				return true;
			}
		}
		return false;
	}
	const addToSelectedExercises = (exercise) => {
		const array = selectedExercises;
		if (!isSelected(exercise)) {
			array.push(exercise);
			setSelectedExercises(array);
		}
	}
	const removeFromSelectedExercises = (exercise_id) => {
		const array = selectedExercises;
		let index = -1;
		for (let idx = 0; idx < array.length; idx++) {
			if (array[idx].exercise === exercise_id) {
				index = idx;
				break;
			}
		}
		if (index >= 0)
			array.splice(index, 1);

		setSelectedExercises(array)
	}
	const nextStep = () => {
		setStep(step + 1);
	}
	const previousStep = () => {
		setStep(step - 1);
	}

	const handleModalClose = () => {
		setOpenModal(false);
		setReload(!reload)
	}
	const deleteTemplate = (template) => {
		return () => {
			setModalContent("delete");
			setOpenModal(true);
			setActionRow(template)
		}
	}
	const editTemplate = (exercise) => {
		return () => {
			setModalContent("edit");
			setOpenModal(true);
			setActionRow(exercise)
		}
	}
	const addTemplate = () => {
		setModalContent("add");
		setOpenModal(true);
	}
	const handlePageChange = (evt, value) => {
		setPage(value);
	}
	const handleSearchChange = (evt) => {
		setQuery(evt.target.value)
	}
	const handleBodyPartChange = (evt) => {
		setBodyPart(evt.target.value);
	}
	useEffect(() => {
		setLoading(true);
		FetchManager.fetch({
			url: `${TEMPLATES_URL}`,
			success_cb: (res) => {
				setTemplates(res.body);
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
			<Box component={"main"} >
				<Box component={"section"}>
					<Container>
						<Typography gutterBottom variant="h5" component="h2">
							Exercise Templates
						</Typography>
					</Container>
					<Container sx={{ display: 'flex', flexDirection: 'row' }}>
						<Container>
							<Typography gutterBottom variant="h5" component="h2">
								Available Templates
							</Typography>
						</Container>
						<Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
							<Button sx={{ height: "1.2em" }} onClick={addTemplate}>Add Template</Button>
						</Container>

					</Container>
					<TemplateCard />

				</Box>
				<Box component={"section"}>
					<Container sx={{ display: 'flex', flexDirection: 'row' }}>
						<Container>
							<Typography gutterBottom variant="h5" component="h2">
								Your Templates
							</Typography>
						</Container>
					</Container>
					<TemplateCard />
				</Box>


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
							<Button sx={{ height: "1.2em" }} onClick={addTemplate}>Add Template</Button>
						</Grid>
					</Grid>
				</Box>
				<Divider />
				<Box component={"section"} sx={{ marginTop: 1, minHeight: "70vh" }}>
					{loading ?
						<LoadingCircle />
						: <Grid container spacing={2} >
							{templates.map(template => (
								<Grid key={template._id} item xl={2} lg={3} md={4} sm={4} xs={6}>
									<ViewTemplateCard modify template={template} editAction={editTemplate(template)} deleteAction={deleteTemplate(template)} />
								</Grid>
							))}
						</Grid>
					}
				</Box>
				<Box mt={2}>
					<Pagination count={pageCount} size="large" page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
				</Box>
			</Box>
			{/* <Box sx={{ minHeight: "200px" }} className="SessionArea">
				{step === 0 && <ExercisePaginate getSelectedExercises={getSelectedExercises} addToSelectedExercises={addToSelectedExercises} removeFromSelectedExercises={removeFromSelectedExercises} />}
				{step === 1 && <ExercisePrescription exercises={selectedExercises} />}
			</Box> */}
			{/* <Box sx={{ display: "flex", justifyContent: "space-around" }}>
				{step > 0 && <Button onClick={previousStep}>Previous</Button>}
				{step < 1 && <Button onClick={nextStep}>Next</Button>}
			</Box> */}
			<CustomModal onClose={handleModalClose}>
				{modalContent === "edit" && <EditExerciseTemplatesForm templates={actionRow} success_cb={handleModalClose} />}
				{modalContent === "delete" && <DeleteExerciseTemplatesForm success_cb={handleModalClose} templates={actionRow} />}
				{modalContent === "view" && <ViewExerciseTemplatesForm templates={actionRow} />}
				{modalContent === "add" && <AddExerciseTemplatesForm success_cb={handleModalClose} />}
			</CustomModal>
		</Layout>
	)
}
export default ExerciseTemplatePage;