import { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Checkbox } from "@mui/material";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ExerciseSelector({
  exercise,
  selected = false,
  addSelected,
  removeSelected,
  exerciseTag,
}) {
  const [expanded, setExpanded] = useState(false);
  const [checked, setChecked] = useState(selected);

  const onSelectChange = (evt) => {
    setChecked(evt.target.checked);
    if (evt.target.checked) {
      addSelected(
        {
          exercise: exercise._id,
          title: exercise.title,
        },
        exerciseTag
      );
    } else {
      removeSelected(exercise._id, exerciseTag);
    }
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        action={<Checkbox checked={checked} onChange={onSelectChange} />}
        title={<Typography variant="subtitle1">{exercise.title}</Typography>}
      />
      <CardMedia
        component="img"
        height="120"
        image={exercise.thumbImage.url}
        alt="thumbImage"
      />
      <CardActions disableSpacing>
        <Typography>{exercise.description.substr(0, 15)}</Typography>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show description"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="subtitle2">{exercise.description}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
