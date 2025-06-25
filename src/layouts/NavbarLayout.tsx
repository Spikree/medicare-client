import DoctorNavbar from "@/components/doctorNavbar";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DoctorNavbar />

      <div className="flex-grow bg-gray-100 p-4 sm:p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
