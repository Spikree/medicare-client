import Auth from "@/pages/Auth";
import LandingPage from "@/pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import AuthRoutes from "./routes/AuthRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

const App = () => {
  const {checkAuth} = useAuthStore();

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
      </Routes>
    </>
  );
};

export default App;
