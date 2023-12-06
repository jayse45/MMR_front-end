import {   Divider, FormControl, Grid, MenuItem, Pagination, Select,   Box, Typography, Checkbox, FormControlLabel, TextField, Container  } from '@mui/material';
import ExerciseInstructionForm from './Exercise/ExerciseInstructionForm';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Button from '../../../components/Button';
import FetchManager from '../../../utils/FetchManager';
import { UrlHelper } from '../../../utils/UrlHelper';
import NotificationManager from '../../../utils/NotificationManager';
import useAuth from '../../../hooks/useAuth';
import ExercisePaginate from './Exercise/ExercisePaginate';
import ExercisePrescription  from './Exercise/ExercisePrescription';
import EditExerciseTemplatesForm from '../../../components/ExerciseTemplate/EditExerciseTemplatesForm';
import DeleteExerciseTemplatesForm from '../../../components/ExerciseTemplate/DeleteExerciseTemplatesForm';
import ViewExerciseTemplatesForm from '../../../components/ExerciseTemplate/ViewExerciseTemplatesForm';
import AddExerciseTemplatesForm from '../../../components/ExerciseTemplate/AddExerciseTemplatesForm';
import CustomModal from '../../../components/Modal/CustomModal';
import Layout from '../../../components/Layout/Layout';
import NavListItems from './NavListItems';


const TEMPLATES_URL = UrlHelper.createApiUrlPath("/api/templates/paginate?");
const BODY_PARTS_URL = UrlHelper.createApiUrlPath("/api/bodyParts");


const TemplateForm = () => {


    //const elements for getting, adding, deleting and viewing tempaltes using the bodyparts search 
    const [templates, setTemplates] = useState([]);
    const [bodyParts, setBodyParts] = useState([]);
	const[loading, setLoading] = useState(false);
    const [bodyPart, setBodyPart] = useState("");
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
	const getSelectedExercises = ()=>(selectedExercises)
	const isSelected = (exercises) =>{
		for (const temp of selectedExercises) {
			if(exercises._id === temp._id) {
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

    const handleModalClose = ()=>{
        setOpenModal(false);
        setReload(!reload)
    }
    const deleteTemplate = (template) =>{
        return ()=>{
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
    const handlePageChange = (evt, value) =>{
        setPage(value);
    }
    const handleSearchChange = (evt) => {
		setQuery(evt.target.value)
	}
    const handleBodyPartChange = (evt) => {
		setBodyPart(evt.target.value);
	}
	useEffect(()=>{
		setLoading(true);
		FetchManager.fetch({
			url: `${TEMPLATES_URL}page=${page -1}&limit=${limit}&query=${query}&bodyPart=${bodyPart}`,
			success_cb: (res)=>{
				setTemplates(res.body);
				setPageCount(res.pagination.pages)
				setLoading(false);
			}
		})
	}, [reload,limit,page,query, bodyPart]);

	useEffect(()=>{
		setLoading(true);
		FetchManager.fetch({
			url:BODY_PARTS_URL,
			success_cb: (res) =>{
				setBodyParts(res.body);
				setLoading(false);
			}

		})
	}, [])
	

	return (
        <Layout navList={NavListItems}>
			<Box component={"main"}>
            <Container>
            	<Typography  component="span" variant="subtitle2" mt={3} sx={{marginTop:'100px'}}>
                Add New Template
                </Typography>
                <Box component={"form"} className='form' method="POST" >
                    <Typography color={"red"} variant="body2" className='infoText'></Typography>
                    <TextField variant="outlined" margin="normal"  required fullWidth id="name" label="Template Name" name="excercise-name"type="text"  />
                    <TextField  variant="outlined" margin="normal" required fullWidth name="password" label="Template Description"type="text" id="description" />
               
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
						<Typography  component="span" variant="subtitle2" mt={3} sx={{marginTop:'100px'}}>
							Warm up Excercises
							</Typography>
                    
                    <Box sx={{ minHeight: "200px" }} className="SessionArea">
				{step === 0 && <ExercisePaginate getSelectedExercises={getSelectedExercises} addToSelectedExercises={addToSelectedExercises} removeFromSelectedExercises={removeFromSelectedExercises} />}
				{step === 1 && <ExercisePrescription exercises={selectedExercises} />}
				</Box>
			<Box sx={{ display: "flex", justifyContent: "space-around" }}>
				{step > 0 && <Button onClick={previousStep}>Previous</Button>}
				{step < 1 && <Button onClick={nextStep}>Next</Button>}
				</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "edit" && <EditExerciseTemplatesForm templates={actionRow} success_cb={handleModalClose} />}
				{modalContent === "delete" && <DeleteExerciseTemplatesForm success_cb={handleModalClose} templates={actionRow} />}
				{modalContent === "view" && <ViewExerciseTemplatesForm templates={actionRow} />}
				{modalContent === "add" && <AddExerciseTemplatesForm success_cb={handleModalClose} />}
			</CustomModal>
                        
                        
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                    <Typography  component="span" variant="subtitle2" mt={3} sx={{marginTop:'100px'}}>
                Main Excercises
				
                </Typography>
                    <Box sx={{ minHeight: "200px" }} className="SessionArea">
				{step === 0 && <ExercisePaginate getSelectedExercises={getSelectedExercises} addToSelectedExercises={addToSelectedExercises} removeFromSelectedExercises={removeFromSelectedExercises} />}
				{step === 1 && <ExercisePrescription exercises={selectedExercises} />}
			</Box>
			<Box sx={{ display: "flex", justifyContent: "space-around" }}>
				{step > 0 && <Button onClick={previousStep}>Previous</Button>}
				{step < 1 && <Button onClick={nextStep}>Next</Button>}
				</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "edit" && <EditExerciseTemplatesForm templates={actionRow} success_cb={handleModalClose} />}
				{modalContent === "delete" && <DeleteExerciseTemplatesForm success_cb={handleModalClose} templates={actionRow} />}
				{modalContent === "view" && <ViewExerciseTemplatesForm templates={actionRow} />}
				{modalContent === "add" && <AddExerciseTemplatesForm success_cb={handleModalClose} />}
			</CustomModal>
                        
                        
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

                    <Typography  component="span" variant="subtitle2" mt={3} sx={{marginTop:'100px'}}>
                Cool Down Excercises
				
                </Typography>
                    
                    <Box sx={{ minHeight: "200px" }} className="SessionArea">
				{step === 0 && <ExercisePaginate getSelectedExercises={getSelectedExercises} addToSelectedExercises={addToSelectedExercises} removeFromSelectedExercises={removeFromSelectedExercises} />}
				{step === 1 && <ExercisePrescription exercises={selectedExercises} />}
			</Box>
			<Box sx={{ display: "flex", justifyContent: "space-around" }}>
				{step > 0 && <Button onClick={previousStep}>Previous</Button>}
				{step < 1 && <Button onClick={nextStep}>Next</Button>}
				</Box>
			<CustomModal onClose={handleModalClose}>
				{modalContent === "edit" && <EditExerciseTemplatesForm templates={actionRow} success_cb={handleModalClose} />}
				{modalContent === "delete" && <DeleteExerciseTemplatesForm success_cb={handleModalClose} templates={actionRow} />}
				{modalContent === "view" && <ViewExerciseTemplatesForm templates={actionRow} />}
				{modalContent === "add" && <AddExerciseTemplatesForm success_cb={handleModalClose} />}
			</CustomModal>
                        
                        
                    </Box>

                    <Button >Save</Button>
                </Box>

            </Container>
			</Box>
		</Layout>
		
	);
}

export default TemplateForm;
