import { Grid, TextField } from "@mui/material";
import { useState } from "react";

const ExerciseInstructionForm = ({
  exerciseData,
  index,
  formRegister: register,
  exerciseTag,
}) => {
  const [formValue, setValueState] = useState({
    exercise: exerciseData.exercise,
    sets: exerciseData.sets ?? 0,
    distance: exerciseData.distance ?? 0,
    reps: exerciseData.reps ?? 0,
    intensity: exerciseData.intensity ?? "",
    time: exerciseData.time ?? 0,
    note: exerciseData.note ?? "",
  });

  // const updateParent = (key, value) => {
  // 	saveUpdateHandler(index, {...formValue, [key]: value})
  // }

  function handleChange(evt) {
    setValueState({
      ...formValue,
      [evt.target.name]: evt.target.value,
    });
    // updateParent(evt.target.name, evt.target.value)
  }

  return (
    <Grid item xs={12} lg={12} className="border rounded mb-1">
      <Grid container direction="row" spacing={1} rowSpacing={2}>
        <Grid item xs={12} lg={12}>
          <TextField
            id="exerciseId"
            label="Exercise"
            size="small"
            fullWidth
            variant="outlined"
            disabled
            // name="exerciseId"
            value={exerciseData.title}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6} lg={6}>
          <TextField
            id="sets"
            label="Sets"
            size="small"
            variant="outlined"
            type="number"
            {...register(`${exerciseTag}.${index}.sets`, {
              min: 0,
            })}
            // name="sets"
            // onChange={handleChange}
            // value={formValue.sets}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6} lg={6}>
          <TextField
            id="reps"
            size="small"
            label="Reps"
            variant="outlined"
            type="number"
            {...register(`${exerciseTag}.${index}.reps`, {
              min: 0,
            })}
            // name="reps"
            // onChange={handleChange}
            // value={formValue.reps}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6} lg={6}>
          <TextField
            id="time"
            variant="outlined"
            size="small"
            label="Time(minutes)"
            type="number"
            {...register(`${exerciseTag}.${index}.time`, {
              min: 0,
            })}
            // name="time"
            // onChange={handleChange}
            // value={formValue.time}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6} lg={6}>
          <TextField
            id="distance"
            label="Distance(meters)"
            type="number"
            size="small"
            {...register(`${exerciseTag}.${index}.distance`, {
              min: 0,
            })}
            // name="distance"
            // onChange={handleChange}
            // value={formValue.distance}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6} lg={6}>
          <TextField
            id="intensity"
            variant="outlined"
            label="Intensity"
            size="small"
            type="text"
            {...register(`${exerciseTag}.${index}.intensity`)}
            // name="intensity"
            // onChange={handleChange}
            // value={formValue.intensity}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} lg={12}>
          <TextField
            fullWidth
            label="Note"
            size="small"
            multiline
            rows={2}
            {...register(`${exerciseTag}.${index}.note`)}
            // name="note"
            // onChange={handleChange}
            // value={formValue.note}
            aria-label="Note"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
export default ExerciseInstructionForm;
