import Auth from "@/pages/Auth";
import LandingPage from "@/pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Dashboard from "./pages/doctor/Dashboard";
import DoctorRoutes from "./routes/DoctorRoute";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import PatientRoutes from "./routes/PatientRoutes";
import SidebarLayout from "./layouts/NavbarLayout";
import Home from "./pages/patient/Home";
import PatientDetailsPage from "./pages/doctor/PatientDetails";
import DoctorDetails from "./pages/patient/DoctorDetails";
import DoctorProfile from "./pages/Profile";
import PatientAiSummary from "./pages/doctor/PatientAiSummary";

const App = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <>
      <Routes>
        <Route element={<AuthRoutes />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route element={<SidebarLayout />}>
            <Route element={<DoctorRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/patientDetails/:patientId/:patientName"
                element={<PatientDetailsPage />}
              />
              <Route
                path="/patientAiSummary/:patientId"
                element={<PatientAiSummary />}
              />
            </Route>
            <Route path="/profile" element={<DoctorProfile />} />

            <Route element={<PatientRoutes />}>
              <Route path="/home" element={<Home />} />
              <Route
                path="/doctorDetails/:doctorId/:doctorName/:doctorStatus"
                element={<DoctorDetails />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
