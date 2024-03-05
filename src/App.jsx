import { Routes, BrowserRouter, Route, Navigate } from "react-router-dom";
import ConfigurationManager from "./utils/ConfigurationManager";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { ToastContainer } from "react-toastify";
import { queryClient } from "./react-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from "./pages/AuthPage";
import RequireAuth from "./components/RequireAuth";
import PatientIndex from "./pages/patient/index";
import HealthProfessionalIndex from "./pages/healthProfessional/index";
import OrganizationIndex from "./pages/organization/index";
import AdminIndex from "./pages/admin/index";
import "./App.scss";
import NotFoundPage from "./components/NotFoundPage";
import useAuth from "./hooks/useAuth";
import RegistrationPage from "./pages/RegistrationPage";
import SubscriptionPaymentController from "./components/Payment/SubscriptionPaymentController";
import PaymentConfirmation from "./components/Payment/PaymentConfirmation";
import Signout from "./components/Login/Signout";
import HealthFacilityIndex from "./pages/healthFacility/index";
import ErrorBoundary from "./context/ErrorBoundary";
import StorageManager from "./utils/StorageManager";
import VerifyEmailBlock from "./components/VerifyEmailBlock";
import VerifyEmailPage from "./components/VerifyEmailPage";
import CONFIG from "./config";

function App() {
  const { getUser } = useAuth();
  const user = getUser();
  const ROLES = ConfigurationManager.getConfig("ROLES_ARRAY");
  const USER_ROLES = ConfigurationManager.getConfig("ROLES");
  if (user?.role && !StorageManager.get("onboarded")) {
    StorageManager.set("onboarded", user["onboarded"]);
  }
  if (
    user?.role === CONFIG.ROLES.HEALTH_PROFESSIONAL &&
    !StorageManager.get("licenseVerified")
  ) {
    StorageManager.set("licenseVerified", user.licenseVerified);
  }

  const status = user?.status === "verified";

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer data-testid="toastContainer" />
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route path="/admin" exact element={<AuthPage page="admin" />} />
              <Route
                path="/registration"
                exact
                element={<RegistrationPage page="registration" />}
              />
              <Route
                path="/password_reset/:token"
                exact
                element={<AuthPage page="password_reset" />}
              />
              <Route
                path="/verify_email/:token"
                exact
                element={<VerifyEmailPage />}
              />
              <Route
                path="/password_reset_request"
                exact
                element={<AuthPage page="password_reset_request" />}
              />
              <Route
                path="/forgot_password"
                exact
                element={<AuthPage page="forgot_password" />}
              />
              <Route path="/login" exact element={<AuthPage />} />
              <Route
                path="pay_subscription/confirmation"
                element={<PaymentConfirmation />}
              />
              <Route path="/*" element={<RequireAuth allowedRoles={ROLES} />}>
                {status || user?.role === USER_ROLES.ADMIN ? (
                  <>
                    <Route
                      path="pay_subscription"
                      element={<SubscriptionPaymentController />}
                    />
                    {user?.role === USER_ROLES.PATIENT && (
                      <Route path="*" element={<PatientIndex />} />
                    )}
                    {user?.role === USER_ROLES.HEALTH_PROFESSIONAL && (
                      <Route path="*" element={<HealthProfessionalIndex />} />
                    )}
                    {user?.role === USER_ROLES.HEALTH_FACILITY && (
                      <Route path="*" element={<HealthFacilityIndex />} />
                    )}
                    {user?.role === USER_ROLES.ORGANIZATION && (
                      <Route path="*" element={<OrganizationIndex />} />
                    )}
                    {user?.role === USER_ROLES.ADMIN && (
                      <Route path="*" element={<AdminIndex />} />
                    )}
                    <Route path="*" element={<NotFoundPage />} />
                  </>
                ) : (
                  <Route
                    path="*"
                    element={<VerifyEmailBlock email={user?.email} />}
                  />
                )}
              </Route>
              <Route path="/logout" exact element={<Signout />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
