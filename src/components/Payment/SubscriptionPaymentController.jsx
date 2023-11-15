import { useState, Fragment, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import AvailableSubscriptions from './AvailableSubscriptions';
import Button from '../Button';
import PaystackProvider from './PaystackProvider';
import PaymentConfirmation from './PaymentConfirmation';
import AuthenticationManager from '../../utils/AuthenticationManager';
import LoadingCircle from '../LoadingCircle';
import SubscriptionManager from '../../utils/SubscriptionManager';
import { Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const steps = ['Select Package', 'Make Payment', 'Subscription Confirmation'];

export default function SubscriptionPaymentController() {
	const [activeStep, setActiveStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [validSubscription, setValidSubscription] = useState(false);
	const [skipped, setSkipped] = useState(new Set());
	const [selectedPackage, setSelectedPackage] = useState("");
	const [paymentReference, setPaymentReference] = useState("");
	const [paymentConfig, setPaymentConfig] = useState({
		reference: AuthenticationManager.getStoredUser()["_id"] + new Date().getTime(),
		email: AuthenticationManager.getStoredUser()["email"],
		amount: selectedPackage?.price,
		currency: "GHS",
		publicKey: '',
	});
	const handleNext = () => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped(newSkipped);
	};
	const handlePackageSelect = (package_info) => {
		setSelectedPackage(package_info);
		setPaymentConfig({
			...paymentConfig,
			amount: package_info.price * 100,
		});
		handleNext();
	}
	const handlePaymentConfirmation = (ref) => {
		setPaymentReference(ref);
		handleNext();
	}
	const isStepSkipped = (step) => {
		return skipped.has(step);
	};

	

	const handleReset = () => {
		setActiveStep(0);
	};
	const validate = async () => {
		const result = await SubscriptionManager.isUserSubscriptionExpired();
		if (result) {
			setValidSubscription(false);
		}
		else {
			setValidSubscription(true);
		}
		setLoading(false);
	}

	useEffect(() => {
		validate();
	})

	return (
		<Box sx={{ width: '98%', p: 2 }}>
			<Stepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps = {};
					const labelProps = {};
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			{activeStep === steps.length ? (
				<Fragment>
					<Typography sx={{ mt: 2, mb: 1 }}>
						All steps completed - you&apos;re finished
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
						<Box sx={{ flex: '1 1 auto' }} />
						<Button onClick={handleReset}>Reset</Button>
					</Box>
				</Fragment>
			) : (
				<Fragment>
					<Box>
						{loading && <LoadingCircle />}
						{validSubscription && <Paper elevation={3} sx={{ p: 5, m: 3 }}>
							<Typography variant="h4" mb={2}>You already have a subscription.</Typography>
							<Typography variant='body2' mb={4}>You can only renew your subscription after it has expired. Thank you.</Typography>
								<Button onClick={() => { window.history.back() }}><ArrowBack/> Go Back</Button>
						</Paper>}
						{!validSubscription && activeStep === 0 && <AvailableSubscriptions cb={handlePackageSelect} />}
						{!validSubscription && activeStep === 1 && <PaystackProvider selectedPackage={selectedPackage} cb={handlePaymentConfirmation} />}
						{!validSubscription && activeStep === 2 && <PaymentConfirmation paymentReference={paymentReference} />}
					</Box>
				</Fragment>
			)}
		</Box>
	);
}
