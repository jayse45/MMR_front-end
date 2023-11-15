import { Routes, Route } from 'react-router-dom';
import AppointmentPage from './appointments';
import Dashboard from './dashboard';
import HistoryPage from './history';
import ProfilePage from './profile';
import SessionPage from './session';
import SessionsPage from './sessions';
import SubscriptionPage from './subscription';
import NotFoundPage from '../../components/NotFoundPage';

function PatientIndex() {
	return (
		<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/appointments" element={<AppointmentPage />} />
			<Route path="/sessions/:session_id" element={<SessionPage />} />
			<Route path="/sessions" element={<SessionsPage />} />
			<Route path="/appointments" exact element={<AppointmentPage />} />
			<Route path="/subscription" element={<SubscriptionPage />} />
			<Route path="/history" exact element={<HistoryPage />} />
			<Route path="/profile" exact element={<ProfilePage />} />
			<Route path="/*" exact element={<NotFoundPage />} />
		</Routes>
	)
}

export default PatientIndex;