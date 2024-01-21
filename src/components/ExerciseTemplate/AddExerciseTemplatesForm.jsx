import React, { Fragment, useEffect, useState } from 'react';
import {
  TextField,
  FormControl,
  Box,
  Typography,
  FormLabel,
  CircularProgress,
  Stepper,
  StepLabel,
  Step,
  MenuItem,
  LinearProgress,
  Container,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FetchManager from '../../utils/FetchManager';
import NotificationManager from '../../utils/NotificationManager';
import { UrlHelper } from '../../utils/UrlHelper';
import Button from '../Button';
import styles from '../Exercise/AddExerciseForm.scss';
import Layout from '../Layout/Layout';
import NavListItems from '../../pages/healthProfessional/components/NavListItems';
import ExercisePaginate from '../../pages/healthProfessional/components/Exercise/ExercisePaginate';
import ExerciseTemplatePrescription from '../../pages/healthProfessional/components/Exercise/ExerciseTemplatePrescription';
import CustomModal from '../Modal/CustomModal';
import EditExerciseTemplatesForm from './EditExerciseTemplatesForm';
import DeleteExerciseTemplatesForm from './DeleteExerciseTemplatesForm';
import ViewExerciseTemplatesForm from './ViewExerciseTemplatesForm';

import useAuth from '../../hooks/useAuth';

const EXERCISE_TEMPLATES_URL = UrlHelper.createApiUrlPath('/api/templates/text');
const EXERCISES_URL = UrlHelper.createApiUrlPath('/api/exercises/text');
const BODY_PARTS_URL = UrlHelper.createApiUrlPath('/api/bodyParts');

const AddExerciseTemplateForm = ({ success_cb }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { setOpenModal } = useAuth();
  const [modalContent, setModalContent] = useState("");
	const [actionRow, setActionRow] = useState("");
  const [bodyPart, setBodyPart] = useState("");
	const [reload, setReload] = useState(false);
  const [exerciseTemplate, setExerciseTemplate] = useState({});
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedWarmupExercises, setSelectedWarmupExercises] = useState([]);
  const [selectedMainExercises, setSelectedMainExercises] = useState([]);
  const [selectedCooldownExercises, setSelectedCooldownExercises] = useState([]);
  const [page, setPage] = useState(1);
	const [query, setQuery] = useState("");
	const [pageCount, setPageCount] = useState(1);
	const limit = 10;
  const [bodyParts, setBodyParts] = useState([]);
  const [formData, setFormData] = useState({
    templateName: "",
    templateDescription: "",
    warmup: [],
    main: [],
    cooldown: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleModalClose = ()=>{
    setOpenModal(false);
    setReload(!reload)
}

  const handleFormChange = (evt) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleTextSubmission = async (evt) => {
    evt.preventDefault();
    setIsLoading(true);

    if (
      formData.templateName === '' ||
      formData.warmup.length === 0 ||
      formData.main.length === 0 ||
      formData.cooldown.length === 0
    ) {
      setIsLoading(false);
      NotificationManager.notifyUser({
        type: 'info',
        message: 'All fields are required',
        toastId: 1,
      });
      return false;
    }

    const body = {
      "templateName": formData.title,
      "templateDescription": formData.description,
      "bodyPart": formData.bodyPart,
      "warmup": formData.warmup,
      "main": formData.main,
      "cooldown": formData.cooldown,
    };

    const res = await FetchManager.asycnFetchJSON({
      url: EXERCISE_TEMPLATES_URL,
      method: 'POST',
      body,
      failure_cb: () => {
        setIsLoading(false);
        NotificationManager.notifyUser({
          type: 'warning',
          message: 'Failed to add exercise template.',
        });
      },
    });

    if (res?.status === 201) {
      NotificationManager.notifyUser({
        type: 'success',
        message: 'Exercise template created successfully.',
      });
      setExerciseTemplate(res.body);
      return true;
    } else {
      return false;
    }
  };
  const saveData = (template) => {
		setLoading(true);
		FetchManager.fetch({
			url: `${EXERCISE_TEMPLATES_URL}${template._id}/templates`,
			method: "PUT",
			body: formData,
			success_cb: (res) => {
				NotificationManager.notifyUser({message: "Prescription saved successfully", type: "success"})
				setLoading(false);
			},
			failure_cb: (res) => {
				setLoading(false);
				NotificationManager.notifyUser({ message: "Failed to save prescription", type: "warning" })
			}
		})

	}
    //This is to handle the moving from step to step
    const nextStepHandler = async (evt) => {
      setIsLoading(true);
      if (step === 0) {
        await handleTextSubmission(evt);
      }
      if (step < 1) {
        setStep(step + 1);
      }
      setIsLoading(false);
    };
    // Warmup
  const nextStepWarmupHandler = async (evt) => {
    setIsLoading(true);
    if (step === 0) {
      await handleTextSubmission(evt);
    }
    if (step < 1) {
      setStep(step + 1);
    }
    setIsLoading(false);
  };

  const previousStepWarmupHandler = async (evt) => {
    setIsLoading(true);
    if (step === 0) {
      await handleTextSubmission(evt);
    }
    if (step > 0) {
      setStep(step - 1);
    }
    setIsLoading(false);
  };

  //Main
  const nextStepMainHandler = async (evt) => {
    setIsLoading(true);
    if (step === 0) {
      await handleTextSubmission(evt);
    }
    if (step < 1) {
      setStep(step + 1);
    }
    setIsLoading(false);
  };

  const previousStepMainHandler = async (evt) => {
    setIsLoading(true);
    if (step === 0) {
      await handleTextSubmission(evt);
    }
    if (step > 0) {
      setStep(step - 1);
    }
    setIsLoading(false);
  };
  const nextStepCooldownHandler = async (evt) => {
    setIsLoading(true);
    if (step === 0) {
      await handleTextSubmission(evt);
    }
    if (step < 1) {
      setStep(step + 1);
    }
    setIsLoading(false);
  };

  const previousStepCooldownHandler = async (evt) => {
    setIsLoading(true);
    if (step === 0) {
      await handleTextSubmission(evt);
    }
    if (step > 0) {
      setStep(step - 1);
    }
    setIsLoading(false);
  };


  
  
 
  const getSelectedExercises = ()=>(selectedExercises)
	const isSelected = (exercises) =>{
		for (const temp of selectedExercises) {
			if(exercises._id === temp._id) {
				return true;
			}
		}
		return false;
	}
 
	const addToSelectedMainExercises = (exercise) => {
		const array = selectedExercises;
		if (!isSelected(exercise)) {
			array.push(exercise);
			setSelectedMainExercises(array);
		}
	}
 
	const addToSelectedWarmupExercises = (exercise) => {
		const array = selectedExercises;
		if (!isSelected(exercise)) {
			array.push(exercise);
			setSelectedWarmupExercises(array);
		}
	}
 
	const addToSelectedCooldownExercises = (exercise) => {
		const array = selectedExercises;
		if (!isSelected(exercise)) {
			array.push(exercise);
			setSelectedCooldownExercises(array);
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
	};
  useEffect(()=>{
		setLoading(true);
		FetchManager.fetch({
			url: `${EXERCISE_TEMPLATES_URL}page=${page -1}&limit=${limit}&query=${query}&bodyPart=${bodyPart}`,
			success_cb: (res)=>{
				setExerciseTemplate(res.body);
				setPageCount(res.pagination.pages)
				setLoading(false);
			}
		})
	}, [reload,limit,page,query, bodyPart]);
  
  useEffect(() => {
    FetchManager.fetch({
      url: BODY_PARTS_URL,
      success_cb: (res) => {
        setBodyParts(res.body);
        setIsLoading(false);
      },
    });
  }, []);

  return (
    <Layout navList={NavListItems}>
      <Box component={"main"} >
        <Container>
          <Typography  component="span" variant="subtitle2" mt={3} sx={{marginTop:'100px'}}>
            Add Exercise Template
          </Typography>
          <Box className="form" method="POST">
            <Box p={3} sx={{ minWidth: '500px' }}>
                <Box>
                  <Box className={styles.formInput}>
                    <FormControl fullWidth>
                      <FormLabel>Template Name</FormLabel>
                      <TextField
                        variant="outlined" 
                        margin="normal"
                        fullWidth
                        disabled={isLoading}
                        required
                        type='text'
                        id="templateName"
                        placeholder="Template Name.."
                        name="templateName"
                        onChange={handleFormChange}
                        value={formData.templateName}
                      />
                    </FormControl>
                  </Box>
                  <Box className={styles.formInput}>
                    <FormControl fullWidth>
                      <FormLabel>Template Description</FormLabel>
                      <TextField
                        variant="outlined" 
                        margin="normal"
                        fullWidth
                        disabled={isLoading}
                        required
                        type='text'
                        id="templateDescription"
                        placeholder="Template Description.."
                        name="templateDescription"
                        onChange={handleFormChange}
                        value={formData.templateDescription}
                      />
                    </FormControl>

                      {/* Warmup */}

                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }} className={styles.formInput} mt={1}>
                    <FormControl fullWidth>
                      <FormLabel>
                        <Typography component="span" variant='subtitle2' mt={3} sx={{marginTop: '100px'}}>
                          Warm up Excercises 
                        </Typography>
                      </FormLabel>
                      {/* Add a component or logic for selecting exercises for warm-up */}
                      {/* For example, you might use a MultiSelect component */}
                      {/* For simplicity, let's assume that you have a component called ExerciseSelector */}
                      {/* that handles the selection of exercises */}
                        <Box sx={{ minHeight: "200px" }} className="SessionArea">
                          {step === 0 && <ExercisePaginate getSelectedExercises={getSelectedExercises} addToSelectedExercises={addToSelectedWarmupExercises} removeFromSelectedExercises={removeFromSelectedExercises} />}
                          {step === 1 && <ExerciseTemplatePrescription exercises={selectedWarmupExercises} />}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                          {step > 0 && <Button onClick={previousStepWarmupHandler}>Previous</Button>}
                          {step < 1 && <Button onClick={nextStepWarmupHandler}>Next</Button>}
                        </Box>
                        <CustomModal onClose={handleModalClose}>
                          {modalContent === "edit" && <EditExerciseTemplatesForm templates={actionRow} success_cb={handleModalClose} />}
                          {modalContent === "delete" && <DeleteExerciseTemplatesForm success_cb={handleModalClose} templates={actionRow} />}
                          {modalContent === "view" && <ViewExerciseTemplatesForm templates={actionRow} />}
                          {/* {modalContent === "add" && <AddExerciseTemplatesForm success_cb={handleModalClose} />} */}
                        </CustomModal>
                        
                    </FormControl>
                  </Box>

                    {/* Main Exercise */}

                  <Box className={styles.formInput} mt={1}>
                    <FormControl fullWidth>
                      <FormLabel>Main Exercises</FormLabel>
                      <Box sx={{ minHeight: "200px" }} className="SessionArea">
                          {step === 0 && <ExercisePaginate getSelectedExercises={getSelectedExercises} addToSelectedExercises={addToSelectedMainExercises} removeFromSelectedExercises={removeFromSelectedExercises} />}
                          {step === 1 && <ExerciseTemplatePrescription exercises={selectedMainExercises} />}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                          {step > 0 && <Button onClick={previousStepMainHandler}>Previous</Button>}
                          {step < 1 && <Button onClick={nextStepMainHandler}>Next</Button>}
                        </Box>
                        <CustomModal onClose={handleModalClose}>
                          {modalContent === "edit" && <EditExerciseTemplatesForm templates={actionRow} success_cb={handleModalClose} />}
                          {modalContent === "delete" && <DeleteExerciseTemplatesForm success_cb={handleModalClose} templates={actionRow} />}
                          {modalContent === "view" && <ViewExerciseTemplatesForm templates={actionRow} />}
                          {/* {modalContent === "add" && <AddExerciseTemplatesForm success_cb={handleModalClose} />} */}
                        </CustomModal>
                    </FormControl>
                  </Box>

                  {/* Cooldown */}
                  <Box className={styles.formInput} mt={1}>
                    <FormControl fullWidth>
                      <FormLabel>Cooldown Exercises</FormLabel>
                      <Box sx={{ minHeight: "200px" }} className="SessionArea">
                          {step === 0 && <ExercisePaginate getSelectedExercises={getSelectedExercises} addToSelectedExercises={addToSelectedCooldownExercises} removeFromSelectedExercises={removeFromSelectedExercises} />}
                          {step === 1 && <ExerciseTemplatePrescription exercises={selectedCooldownExercises} />}
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                          {step > 0 && <Button onClick={previousStepCooldownHandler}>Previous</Button>}
                          {step < 1 && <Button onClick={nextStepCooldownHandler}>Next</Button>}
                        </Box>
                        <CustomModal onClose={handleModalClose}>
                          {modalContent === "edit" && <EditExerciseTemplatesForm templates={actionRow} success_cb={handleModalClose} />}
                          {modalContent === "delete" && <DeleteExerciseTemplatesForm success_cb={handleModalClose} templates={actionRow} />}
                          {modalContent === "view" && <ViewExerciseTemplatesForm templates={actionRow} />}
                        </CustomModal>
                    </FormControl>
                  </Box>
                </Box>
            </Box>
                    <Box mt={2} px={3}>
				              {isLoading ? <CircularProgress /> : step < 4 ? <Button type="submit" disabled={isLoading} onClick={nextStepHandler}>Save and Continue</Button>: <></>}
			              </Box>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};



export default AddExerciseTemplateForm;
