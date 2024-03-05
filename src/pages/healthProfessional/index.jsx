import {
	Routes,
	Route,
} from "react-router-dom";
import SubscriptionPage from './subscription';
import DashboardPage from './dashboard';
import ProfilePage from './profile';
import SessionPage from './session';
import SessionsPage from './sessions';
import PatientsPage from './patients';
import AuthenticationManager from '../../utils/AuthenticationManager';
import OnboardHealthProfessional from './components/OnboardHealthProfessional';
import AppointmentPage from './appointments';
import StorageManager from "../../utils/StorageManager";
import ExerciseTemplatePage from "./templates";
import TemplateForm from "./components/TemplateForm";
import AddExerciseTemplatesForm from "../../components/ExerciseTemplate/AddExerciseTemplatesForm";


function HealthProfessionalIndex() {
	const onboarded = JSON.parse(StorageManager.get("onboarded"))
	const licenseVerified = JSON.parse(StorageManager.get("licenseVerified"))
	
	return (
		<>{
			onboarded ?
				<Routes>
					{licenseVerified &&
						<><Route path="/" exact element={<DashboardPage />} />
							<Route path="/sessions/:session_id" element={<SessionPage />} />
							<Route path="/sessions" element={<SessionsPage />} />
							<Route path="/patients" element={<PatientsPage />} />
							<Route path="/templateform" element={<AddExerciseTemplatesForm/>} />
							<Route path="/templates" element={<ExerciseTemplatePage/>}/>
							{AuthenticationManager.getStoredUser().creator.type === "public" && <Route path="/appointments" element={<AppointmentPage />} />}
							<Route path="/subscription" element={<SubscriptionPage />} />
							<Route path="/profile" element={<ProfilePage />} />
						</>
					}
					{!licenseVerified && <><Route path="/*" element={<ProfilePage />} /></>}
					<Route path="/*" exact element={<h1>Unavailable</h1>} />
				</Routes>
				: <OnboardHealthProfessional />
		}
		</>
	)
}

export default HealthProfessionalIndex;