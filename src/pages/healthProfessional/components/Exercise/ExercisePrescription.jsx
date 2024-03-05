import { Box, LinearProgress, Paper } from "@mui/material";
import ExerciseInstructionForm from "./ExerciseInstructionForm";
import { useState } from "react";
import Button from "../../../../components/Button";
import FetchManager from "../../../../utils/FetchManager";
import { UrlHelper } from "../../../../utils/UrlHelper";
import NotificationManager from "../../../../utils/NotificationManager";

const SESSIONS_URL = UrlHelper.createApiUrlPath("/api/sessions/users/");
const ExercisePrescription = ({
  exercises = [],
  exerciseTag,
  formRegister,
  session,
}) => {
  const exercisesData = [];
  const [loading, setLoading] = useState(false);
  for (let i = 0; i < exercises.length; i++) {
    exercisesData[i] = {
      exercise: exercises[i]._id,
      title: exercises[i].title,
      sets: exercises[i].sets ?? 0,
      distance: exercises[i].distance ?? 0,
      reps: exercises[i].reps ?? 0,
      intensity: exercises[i].intensity ?? "",
      time: exercises[i].time ?? 0,
      note: exercises[i].note ?? "",
    };
  }

  const updateHandler = (index, data) => {
    exercisesData[index] = data;
  };

  const saveData = () => {
    setLoading(true);
    FetchManager.fetch({
      url: `${SESSIONS_URL}${session._id}/exercises`,
      method: "PUT",
      body: exercisesData,
      success_cb: (res) => {
        NotificationManager.notifyUser({
          message: "Prescription saved successfully",
          type: "success",
        });
        setLoading(false);
      },
      failure_cb: (res) => {
        setLoading(false);
        NotificationManager.notifyUser({
          message: "Failed to save prescription",
          type: "warning",
        });
      },
    });
  };

  let index = -1;

  return (
    <Box sx={{ marginBottom: "1em" }}>
      {exercises.map((exercise, index) => {
        return (
          <Paper key={exercise.exercise} sx={{ p: "0.5em", m: "0.3em" }}>
            <ExerciseInstructionForm
              exerciseData={exercise}
              formRegister={formRegister}
              //   saveUpdateHandler={updateHandler}
              index={index}
              exerciseTag={exerciseTag}
            />
          </Paper>
        );
      })}
      {/* <Box>
				<Button disabled={loading} onClick={saveData}>Save</Button>
				{loading && <LinearProgress sx={{width: "70px"}}/>}
			</Box> */}
    </Box>
  );
};

export default ExercisePrescription;
