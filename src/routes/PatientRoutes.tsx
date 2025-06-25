import { Outlet, Navigate } from "react-router-dom";

const PatientRoutes = () => {
  const role: string | null = localStorage.getItem("user_role");
  return role === "doctor" ? <Outlet /> : <Navigate to={"/home"} />;
};

export default PatientRoutes;