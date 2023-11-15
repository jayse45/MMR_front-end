import {
	Routes,
	Route,
} from "react-router-dom";
import Dashboard from './dashboard';
import UsersPage from './users';
import ProfilePage from './profile';
import SubscriptionPage from './subscription';

function HealthFacilityIndex() {
	return (
		<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/health_professional" element={<UsersPage />} />
			<Route path="/profile" exact element={<ProfilePage />} />
			<Route path="/subscription" exact element={<SubscriptionPage />} />
			<Route path="/*" exact element={<h1>Unavailable</h1>} />
		</Routes>
	)
}

export default HealthFacilityIndex;