import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Pagination,
  Grid,
  Skeleton,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import useDebounce from "../../../../hooks/useDebounce";
import { useExercises } from "../../../../hooks/useExercises";
import { useBodyParts } from "../../../../hooks/useBodyParts";
import ExerciseSelector from "../ExerciseSelector";

const ExercisePaginate = ({
  getSelectedExercises,
  addToSelectedExercises,
  removeFromSelectedExercises,
  exerciseTag,
}) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [bodyPart, setBodyPart] = useState("");
  const [pagesFallback, setPageFallback] = useState(0);

  // to avoid an API call being made for each character entered
  const debouncedQuery = useDebounce(query, 300);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleQueryChange = (evt) => {
    setQuery(evt.target.value);
  };

  const { isLoading: exercisesLoading, data } = useExercises(
    page,
    debouncedQuery,
    bodyPart
  );

  useEffect(() => {
    setPageFallback(data?.pagination?.pages);
  }, []);

  const { isLoading: bodyPartsLoading, data: bodyPartsData } = useBodyParts();

  const isSelected = (id) => {
    for (const exercise of getSelectedExercises(exerciseTag)) {
      if (id === exercise._id) {
        return true;
      }
    }
    return false;
  };
  const handleBodyPartChange = (evt) => {
    setBodyPart(evt.target.value);
  };

  return (
    <Box>
      <Box
        sx={{
          margin: "2px 3px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ marginTop: 1 }}>
          <TextField
            size="small"
            name="query"
            id="query"
            label="search"
            value={query}
            onChange={handleQueryChange}
          />
        </Box>
        <Box sx={{ marginTop: 1 }}>
          <FormControl variant="standard" sx={{ minWidth: "100px" }}>
            <Select
              size={"small"}
              variant="outlined"
              sx={{ width: "200px" }}
              disabled={bodyPartsLoading}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              onChange={handleBodyPartChange}
              value={bodyPart}
            >
              <MenuItem key={0} value={""} selected>
                ALL
              </MenuItem>
              {bodyPartsData?.body.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name.toLocaleUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {exercisesLoading && (
        <Box sx={{ minHeight: "200px", marginTop: 1 }}>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} lg={6} key={item}>
                <Skeleton
                  variant="rectanglar"
                  width={"202px"}
                  height={"220px"}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {!exercisesLoading && (
        <Box sx={{ minHeight: "50vh", marginTop: 1 }}>
          <Grid container spacing={2}>
            {data?.body.map((item) => (
              <Grid item xs={12} lg={6} key={item._id}>
                <ExerciseSelector
                  exercise={item}
                  addSelected={addToSelectedExercises}
                  removeSelected={removeFromSelectedExercises}
                  selected={isSelected(item._id)}
                  exerciseTag={exerciseTag}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Box sx={{ marginTop: 6, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={data ? data?.pagination?.pages : pagesFallback}
          variant="outlined"
          shape="rounded"
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default ExercisePaginate;
