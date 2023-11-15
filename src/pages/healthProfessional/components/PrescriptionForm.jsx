import { Box } from '@mui/system';
import { useState } from 'react';
import Button from '../../../components/Button';
import ExercisePaginate from './Exercise/ExercisePaginate';
import ExercisePrescription from './Exercise/ExercisePrescription';

const PrescriptionForm = ({ session }) => {
	const [selectedExercises, setSelectedExercises] = useState(session.exercises ?? []);
	const [step, setStep] = useState(0);
	const getSelectedExercises = () => (selectedExercises);

	const isSelected = (exercise) => {
		for (const temp of selectedExercises) {
			if (exercise._id === temp._id) {
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
	return (
		<Box>
			<Box sx={{ minHeight: "200px" }} className="SessionArea">
				{step === 0 && <ExercisePaginate getSelectedExercises={getSelectedExercises} addToSelectedExercises={addToSelectedExercises} removeFromSelectedExercises={removeFromSelectedExercises} />}
				{step === 1 && <ExercisePrescription exercises={selectedExercises} session={session} />}
			</Box>
			<Box sx={{ display: "flex", justifyContent: "space-around" }}>
				{step > 0 && <Button onClick={previousStep}>Previous</Button>}
				{step < 1 && <Button onClick={nextStep}>Next</Button>}
			</Box>
		</Box>
	);
}

export default PrescriptionForm;
