import React, { Fragment, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import {
  TextField,
  FormControl,
  Box,
  Typography,
  FormLabel,
  CircularProgress,
  Pagination,
  Stepper,
  StepLabel,
  Step,
  MenuItem,
  Container,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FetchManager from "../../utils/FetchManager";
import NotificationManager from "../../utils/NotificationManager";
import { UrlHelper } from "../../utils/UrlHelper";
import Button from "../Button";
import styles from "../Exercise/AddExerciseForm.scss";
import Layout from "../Layout/Layout";
import NavListItems from "../../pages/healthProfessional/components/NavListItems";
import ExercisePaginate from "../../pages/healthProfessional/components/Exercise/ExercisePaginate";
import ExercisePrescription from "../../pages/healthProfessional/components/Exercise/ExercisePrescription";
import CustomModal from "../Modal/CustomModal";
import EditExerciseTemplatesForm from "./EditExerciseTemplatesForm";
import DeleteExerciseTemplatesForm from "./DeleteExerciseTemplatesForm";
import ViewExerciseTemplatesForm from "./ViewExerciseTemplatesForm";
import useAuth from "../../hooks/useAuth";
import {
  getTimestamp,
  getCreatorDetails,
  getLastEditorDetails,
} from "../../utils/utils";
import { useNavigate } from "react-router-dom";

const EXERCISE_TEMPLATES_URL = UrlHelper.createApiUrlPath("/api/templates/");

const AddExerciseTemplateForm = ({ success_cb }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { setOpenModal, getUser } = useAuth();
  const [modalContent, setModalContent] = useState("");
  const [actionRow, setActionRow] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [reload, setReload] = useState(false);
  const [exerciseTemplate, setExerciseTemplate] = useState({});
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const limit = 10;
  const [isLoading, setIsLoading] = useState(false);
  const handleModalClose = () => {
    setOpenModal(false);
    setReload(!reload);
  };
  const MIN_STEP = 0;
  const MAX_STEP = 5;
  const exerciseTagType = {
    WARMUP: "warmup",
    MAIN: "main",
    COOLDOWN: "cooldown",
  };
  const navigate = useNavigate();

  // setting up React Hook Form
  const { watch, register, handleSubmit, control, getValues } = useForm({
    defaultValues: {
      title: "",
      description: "",
      warmup: [],
      main: [],
      cooldown: [],
    },

    /* defaultValues: {
      title: "Test Template",
      description: "This is a test template",
      warmup: [
        {
          exercise: "648b351e15ae9a575003f3b3",
          title: "CALF RAISES",
          sets: "2",
          reps: "6",
          time: "15",
          distance: "",
          intensity: "Hard",
          note: "If you feel pain, stop immediately",
        },
        {
          exercise: "648b3e5cad57c0c935550eb7",
          title: "SHOULDER RETRACTION EXERCISE ",
          sets: "1",
          reps: "2",
          time: "10",
          distance: "100",
          intensity: "Medium",
          note: "",
        },
      ],
      main: [
        {
          exercise: "648b5ef676bbe5ca05e4d347",
          title: "ULNAR NERVE STRETCH",
          sets: "3",
          reps: "2",
          time: "10",
          distance: "",
          intensity: "Easy",
          note: "",
        },
        {
          exercise: "648b351e15ae9a575003f3b3",
          title: "CALF RAISES",
          sets: "3",
          reps: "1",
          time: "12",
          distance: "",
          intensity: "Hard",
          note: "",
        },
      ],
      cooldown: [
        {
          exercise: "648b528bd146c9b86af6b377",
          title: "NECK RETRACTION ",
          sets: "3",
          reps: "5",
          time: "10",
          distance: "",
          intensity: "Easy",
          note: "",
        },
        {
          exercise: "648b5ef676bbe5ca05e4d347",
          title: "ULNAR NERVE STRETCH",
          sets: "1",
          reps: "1",
          time: "5",
          distance: "",
          intensity: "Easy",
          note: "",
        },
      ],
      timestamp: 1709650745363,
      thumbImage: {
        key: "default-exercise-template.png",
      },
      healthProfessional: "65506c52dc1f2725963ea7f1",
      creator: {
        userRole: "pro",
        user: "65506c52dc1f2725963ea7f1",
      },
      lastEditor: {
        userRole: "pro",
        user: "65506c52dc1f2725963ea7f1",
      },
    }, */
  });

  // setting up state management for warmup exercises

  const {
    fields: warmupExercises,
    append: appendWarmupExercise,
    remove: removeWarmUpExercise,
  } = useFieldArray({
    name: exerciseTagType.WARMUP,
    control,
  });
  // setting up state management for main exercises

  const {
    fields: mainExercises,
    append: appendMainExercise,
    remove: removeMainExercise,
  } = useFieldArray({
    name: exerciseTagType.MAIN,
    control,
  });
  // setting up state management for cooldown exercises

  const {
    fields: cooldownExercises,
    append: appendCooldownExercise,
    remove: removeCooldownExercise,
  } = useFieldArray({
    name: exerciseTagType.COOLDOWN,
    control,
  });

  // render form navigation elements conditionally depending on the current step
  const renderButtons = () => {
    console.log(step);
    if (step > MAX_STEP) {
      return undefined;
    } else if (step === MAX_STEP) {
      return (
        <Box mt={2} px={3}>
          {false && (
            <Box
              my={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CheckCircleIcon
                sx={{ color: "green", width: "100px", height: "100px" }}
              />
              <Typography variant="subtitle2">
                Exercise Template Added Successfully
              </Typography>
            </Box>
          )}
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Button onClick={previousStepHandler}>Previous</Button>
              <Button
                type="submit"
                onClick={handleSubmit(handleTextSubmission)}
                disabled={isLoading}
              >
                Save Template
              </Button>
            </Box>
          )}
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          {step > 0 && <Button onClick={previousStepHandler}>Previous</Button>}
          {step <= MAX_STEP - 1 && (
            <Button onClick={nextStepHandler}>Next</Button>
          )}
        </Box>
      );
    }
  };

  const handleTextSubmission = async (data) => {
    // console.log(data);
    const { _id: user = "", role = "" } = getUser();
    console.log(user, role, process.env.REACT_APP_HEALTH_PROFESSIONAL_ROLE);
    const payload = {
      ...data,
      timestamp: getTimestamp(),
      thumbImage: {
        key: "default-exercise-template.png",
      },
      healthProfessional:
        role === process.env.REACT_APP_HEALTH_PROFESSIONAL_ROLE
          ? user
          : undefined,
      creator: getCreatorDetails(role, user),
      lastEditor: getLastEditorDetails(role, user),
    };

    navigate("/created-template", { state: payload });
    // console.log(JSON.stringify(payload));
    // const res = await FetchManager.asyncFetchJSON({
    //   url: EXERCISE_TEMPLATES_URL,
    //   method: "POST",
    //   body: JSON.stringify(payload),
    //   failure_cb: (err) => {
    //     console.log(err);
    //     setIsLoading(false);
    //     NotificationManager.notifyUser({
    //       type: "error",
    //       message: "Failed to add exercise template.",
    //     });
    //   },
    // });
    // if (res?.status === 201) {
    //   NotificationManager.notifyUser({
    //     type: "success",
    //     message: "Exercise template created successfully.",
    //   });
    //   setExerciseTemplate(res.body);
    //   return true;
    // } else {
    //   return false;
    // }
  };
  //This is to handle the moving from step to step
  const nextStepHandler = async (evt) => {
    setIsLoading(true);

    setStep((prevStep) => prevStep + 1);
    // if (step === 0) {
    //   await handleTextSubmission(evt);
    // }
    // if (step < 1) {
    //   setStep(step + 1);
    // }
    setIsLoading(false);
  };
  const previousStepHandler = async (evt) => {
    setIsLoading(true);

    setStep((prevStep) => prevStep - 1);
    // if (step === 0) {
    //   await handleTextSubmission(evt);
    // }
    // if (step < 1) {
    //   setStep(step - 1);
    // }
    setIsLoading(false);
  };

  const getSelectedExercisesInExerciseTag = (exerciseTag) =>
    getValues()[exerciseTag];

  const isSelectedInExerciseTag = (exercise, exerciseTag) => {
    for (const temp of getValues()[exerciseTag]) {
      if (exercise.exercise === temp.exercise) {
        return true;
      }
    }
    return false;
  };

  const addToSelectedExerciseTag = (exercise, exerciseTag) => {
    // console.log("in here");
    if (!isSelectedInExerciseTag(exercise, exerciseTag)) {
      switch (exerciseTag) {
        case exerciseTagType.WARMUP:
          // console.log(exerciseTagType.WARMUP);
          appendWarmupExercise(exercise);
          break;
        case exerciseTagType.MAIN:
          appendMainExercise(exercise);
          break;
        case exerciseTagType.COOLDOWN:
          appendCooldownExercise(exercise);
          break;
      }
    }
  };
  const removeFromSelectedExerciseTag = (exercise_id, exerciseTag) => {
    if (exerciseTag === exerciseTagType.WARMUP) {
      // console.log("in remove warmup");
      warmupExercises.map((warmupExercise, index) => {
        if (warmupExercise.exercise === exercise_id) {
          removeWarmUpExercise(index);
        }
      });
    } else if (exerciseTag === exerciseTagType.MAIN) {
      // console.log("in remove warmup");
      mainExercises.map((mainExercise, index) => {
        if (mainExercise.exercise === exercise_id) {
          removeMainExercise(index);
        }
      });
    } else if (exerciseTag === exerciseTagType.COOLDOWN) {
      // console.log("in remove warmup");
      cooldownExercises.map((cooldownExercise, index) => {
        if (cooldownExercise.exercise === exercise_id) {
          removeCooldownExercise(index);
        }
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    FetchManager.fetch({
      url: `${EXERCISE_TEMPLATES_URL}`,
      success_cb: (res) => {
        setExerciseTemplate(res.body);
        // setPageCount(res.pagination.pages);
        setLoading(false);
      },
    });
  }, [reload, limit, page, query, bodyPart]);

  return (
    <Layout navList={NavListItems}>
      <Box component={"main"}>
        <Container>
          <Typography
            component="span"
            variant="subtitle2"
            mt={3}
            sx={{ marginTop: "100px" }}
          >
            Add Exercise Template
          </Typography>
          {/* <Stepper activeStep={step} mb={2}>
            <Step key={'text'}>
              <StepLabel>{'Text'}</StepLabel>
            </Step>
          </Stepper> */}
          <Fragment>
            <Box p={3} sx={{ minWidth: "500px" }}>
              {step === 0 && (
                <Box>
                  <Box className={styles.formInput}>
                    <FormControl fullWidth>
                      <FormLabel>Template Name</FormLabel>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        disabled={isLoading}
                        type="text"
                        id="templateName"
                        placeholder="Template Name.."
                        {...register("title", { required: true })}
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
                        type="text"
                        id="templateDescription"
                        placeholder="Template Description.."
                        {...register("description", { required: true })}
                      />
                    </FormControl>
                  </Box>
                  {/* Warmup */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                    className={styles.formInput}
                    mt={1}
                  >
                    <FormControl fullWidth>
                      <FormLabel>Warm up Excercises</FormLabel>
                      {/* Add a component or logic for selecting exercises for warm-up */}
                      {/* For example, you might use a MultiSelect component */}
                      {/* For simplicity, let's assume that you have a component called ExerciseSelector */}
                      {/* that handles the selection of exercises */}
                      <Box sx={{ minHeight: "200px" }} className="SessionArea">
                        {step === 0 && (
                          <ExercisePaginate
                            getSelectedExercises={
                              getSelectedExercisesInExerciseTag
                            }
                            addToSelectedExercises={addToSelectedExerciseTag}
                            removeFromSelectedExercises={
                              removeFromSelectedExerciseTag
                            }
                            exerciseTag={exerciseTagType.WARMUP}
                          />
                        )}
                        {/* {step === 1 && (
                          <ExercisePrescription exercises={selectedExercises} />
                        )} */}
                      </Box>
                      {renderButtons()}
                    </FormControl>
                  </Box>
                </Box>
              )}
              {/* Main Exercise */}

              {step === 1 && (
                <Box className={styles.formInput} mt={1}>
                  <FormControl fullWidth>
                    <FormLabel>Main Exercises</FormLabel>
                    <Box sx={{ minHeight: "200px" }} className="SessionArea">
                      <ExercisePaginate
                        getSelectedExercises={getSelectedExercisesInExerciseTag}
                        addToSelectedExercises={addToSelectedExerciseTag}
                        removeFromSelectedExercises={
                          removeFromSelectedExerciseTag
                        }
                        exerciseTag={exerciseTagType.MAIN}
                      />
                      <ExercisePrescription exercises={selectedExercises} />
                      {/* {step === 1 && (
                        <ExercisePrescription exercises={selectedExercises} />
                      )} */}
                    </Box>
                    {renderButtons()}
                  </FormControl>
                </Box>
              )}

              {step === 2 /* Cooldown */ && (
                <Box className={styles.formInput} mt={1}>
                  <FormControl fullWidth>
                    <FormLabel>Cooldown Exercises</FormLabel>
                    <Box sx={{ minHeight: "200px" }} className="SessionArea">
                      {step === 2 && (
                        <ExercisePaginate
                          getSelectedExercises={
                            getSelectedExercisesInExerciseTag
                          }
                          addToSelectedExercises={addToSelectedExerciseTag}
                          removeFromSelectedExercises={
                            removeFromSelectedExerciseTag
                          }
                          exerciseTag={exerciseTagType.COOLDOWN}
                        />
                      )}
                      {/* {step === 1 && (
                        <ExercisePrescription exercises={selectedExercises} />
                      )} */}
                    </Box>
                    {renderButtons()}
                    <CustomModal onClose={handleModalClose}>
                      {modalContent === "edit" && (
                        <EditExerciseTemplatesForm
                          templates={actionRow}
                          success_cb={handleModalClose}
                        />
                      )}
                      {modalContent === "delete" && (
                        <DeleteExerciseTemplatesForm
                          success_cb={handleModalClose}
                          templates={actionRow}
                        />
                      )}
                      {modalContent === "view" && (
                        <ViewExerciseTemplatesForm templates={actionRow} />
                      )}
                    </CustomModal>
                  </FormControl>
                </Box>
              )}
              {step === 3 /* warmup prescriptions */ && (
                <Box className={styles.formInput} mt={1}>
                  <FormControl fullWidth>
                    <FormLabel>Warmup Exercises Prescription</FormLabel>
                    <Box sx={{ minHeight: "200px" }} className="SessionArea">
                      <ExercisePrescription
                        formRegister={register}
                        exercises={warmupExercises}
                        exerciseTag={exerciseTagType.WARMUP}
                      />
                    </Box>
                  </FormControl>
                  {renderButtons()}
                </Box>
              )}
              {step === 4 /* main prescriptions */ && (
                <Box className={styles.formInput} mt={1}>
                  <FormControl fullWidth>
                    <FormLabel>Main Exercises Prescription</FormLabel>
                    <Box sx={{ minHeight: "200px" }} className="SessionArea">
                      <ExercisePrescription
                        formRegister={register}
                        exercises={mainExercises}
                        exerciseTag={exerciseTagType.MAIN}
                      />
                    </Box>
                  </FormControl>
                  {renderButtons()}
                </Box>
              )}
              {step === 5 /* cooldown prescriptions */ && (
                <Box className={styles.formInput} mt={1}>
                  <FormControl fullWidth>
                    <FormLabel>Cooldown Exercises Prescription</FormLabel>
                    <Box sx={{ minHeight: "200px" }} className="SessionArea">
                      <ExercisePrescription
                        formRegister={register}
                        exercises={cooldownExercises}
                        exerciseTag={exerciseTagType.COOLDOWN}
                      />
                    </Box>
                  </FormControl>
                  {renderButtons()}
                </Box>
              )}
            </Box>
          </Fragment>
          <Box mt={2} px={3}>
            {false && (
              <Box
                my={3}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CheckCircleIcon
                  sx={{ color: "green", width: "100px", height: "100px" }}
                />
                <Typography variant="subtitle2">
                  Exercise Template Added Successfully
                </Typography>
              </Box>
            )}
          </Box>
          {/* <DevTool control={control} /> */}
        </Container>
      </Box>
      {/* <pre>{JSON.stringify(watch(), null, 4)}</pre> */}
    </Layout>
  );
};

export default AddExerciseTemplateForm;
