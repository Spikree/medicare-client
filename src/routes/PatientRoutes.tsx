import { Outlet, Navigate } from "react-router-dom";

const PatientRoutes = () => {
  const role: string | null = localStorage.getItem("user_role");
  return role === "patient" ? <Outlet /> : <Navigate to={"/dashboard"} />;
};

export default PatientRoutes;