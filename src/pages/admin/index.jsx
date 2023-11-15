import { Routes, Route } from 'react-router-dom';
import SubscriptionPage from './subscriptions';
import AdminsPage from './admins';
import AppointmentPage from './appointments';
import Dashboard from './dashboard';
import ExercisePage from './exercises';
import PaymentPage from './payments';
import SessionsPage from './sessions';
import UsersPage from './users';
import SettingsPage from './settings';
import SubscriptionPackagesPage from './subscriptionPackage';
import ProfilePage from './profile';
import ApprovalsPage from './approvals';

function AdminIndex() {
	return (
		<Routes>
			<Route path="" exact element={<Dashboard />} />
			<Route path="/appointments" exact element={<AppointmentPage />} />
			<Route path="/exercises" exact element={<ExercisePage />} />
			<Route path="/sessions" exact element={<SessionsPage />} />
			<Route path="/approvals" exact element={<ApprovalsPage />} />
			<Route path="/users" exact element={<UsersPage />} />
			<Route path="/admins" exact element={<AdminsPage />} />
			<Route path="/payments" exact element={<PaymentPage />} />
			<Route path="/subscriptionPackages" exact element={<SubscriptionPackagesPage />} />
			<Route path="/subscriptions" exact element={<SubscriptionPage />} />
			<Route path="/settings" exact element={<SettingsPage />} />
			<Route path="/*" exact element={<ProfilePage />} />
		</Routes>
	)
}

export default AdminIndex;