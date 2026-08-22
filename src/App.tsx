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
import { Loader } from "lucide-react";
import ChatPageDoctor from "./pages/doctor/ChatPageDoctor";
import ChatPagePatient from "./pages/patient/ChatPagePatient";
import AddPatientHealthInfo from "./components/AddPatientHealthInfo";
import CheckoutPage from "./pages/stripe/CheckoutPage";
import SuccessPage from "./pages/stripe/SuccessPage";

const App = () => {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader className="h-7 w-7 animate-spin text-primary" />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Starting up — the backend is hosted on a free tier and can take a
            moment to wake.
          </p>
        </div>
      </div>
    );
  }
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
                path="/patientDetails/:patientId/:patientName/:patientStatus"
                element={<PatientDetailsPage />}
              />
              <Route
                path="/patientAiSummary/:patientId/:patientName"
                element={<PatientAiSummary />}
              />
              <Route path="/chatPage/:patientId" element={<ChatPageDoctor />} />
              <Route path="/checkOut" element={<CheckoutPage />} />
            </Route>
            <Route path="/profile" element={<DoctorProfile />} />

            <Route element={<PatientRoutes />}>
              <Route path="/home" element={<Home />} />
              <Route
                path="/doctorDetails/:doctorId/:doctorName/:doctorStatus"
                element={<DoctorDetails />}
              />
              <Route
                path="/chatPagePatient/:doctorId"
                element={<ChatPagePatient />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="/success" element={<SuccessPage />} />
      </Routes>

      {authUser?.role === "patient" && <AddPatientHealthInfo />}
    </>
  );
};

export default App;
