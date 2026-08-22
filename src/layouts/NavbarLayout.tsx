import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface text-surface-foreground">
      <Header />

      <div className="scrollbar-slim flex-grow overflow-y-auto">
        <div className="container py-6 lg:py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
