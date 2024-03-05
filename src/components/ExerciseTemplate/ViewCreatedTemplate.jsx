import React from "react";
import { useLocation } from "react-router-dom";

import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  makeStyles,
} from "@mui/material";

// const useStyles = makeStyles((theme) => ({
//   card: {
//     marginBottom: theme.spacing(2),
//   },
//   exerciseTitle: {
//     fontWeight: "bold",
//   },
// }));

const ViewCreatedTemplate = () => {
  const location = useLocation();
  const data = location.state;
  //   return <pre>{JSON.stringify(location.state, null, 2)}</pre>;

  //   const classes = useStyles();

  const renderExerciseRow = (exercise) => (
    <TableRow key={exercise.exercise}>
      <TableCell>{exercise.title}</TableCell>
      <TableCell>
        {exercise.sets} x {exercise.reps}
      </TableCell>
      <TableCell>
        {exercise.time} {"minutes"}
      </TableCell>
      <TableCell>{exercise.intensity}</TableCell>
      <TableCell>{exercise.note}</TableCell>
    </TableRow>
  );

  const renderTableHeader = (section) => (
    <TableRow>
      <TableCell
        style={{
          fontStyle: "bold",
        }}
      >
        Exercise Name
      </TableCell>
      <TableCell
        style={{
          fontStyle: "bold",
        }}
      >
        Sets x Reps
      </TableCell>
      <TableCell
        style={{
          fontStyle: "bold",
        }}
      >
        Duration (Minutes)
      </TableCell>
      <TableCell
        style={{
          fontStyle: "bold",
        }}
      >
        Difficulty
      </TableCell>
      <TableCell
        style={{
          fontStyle: "bold",
        }}
      >
        Additional Notes
      </TableCell>
    </TableRow>
  );

  return (
    <div
      style={{
        padding: "100px",
      }}
    >
      <Grid container spacing={2}>
        <Typography variant="h2">
          Exercise Template successfully created!
        </Typography>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Name: {data.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Description: {data.description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Warmup" />
            <CardContent>
              <Table>
                <TableHead>{renderTableHeader("warmup")}</TableHead>
                <TableBody>{data.warmup.map(renderExerciseRow)}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Main" />
            <CardContent>
              <Table>
                <TableHead>{renderTableHeader("main")}</TableHead>
                <TableBody>{data.main.map(renderExerciseRow)}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Cooldown" />
            <CardContent>
              <Table>
                <TableHead>{renderTableHeader("cooldown")}</TableHead>
                <TableBody>{data.cooldown.map(renderExerciseRow)}</TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewCreatedTemplate;
