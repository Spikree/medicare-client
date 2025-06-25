import {
    Bell,
    Home,
    LineChart,
    LogOut,
    Package2,
    Users,
  } from "lucide-react";
  import { Link, useLocation } from "react-router-dom";
  import { Button } from "./ui/button";
  import clsx from "clsx";
  
  const DoctorNavbar = () => {
    const location = useLocation();
  
    const getLinkClass = (path: string) =>
      clsx(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
        location.pathname === path
          ? "text-primary border-b-2 border-primary"
          : "text-muted-foreground hover:text-primary"
      );
  
    return (
      <header className="w-full border-b bg-muted/40 shadow-sm">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            <Link to="/" className="font-semibold text-lg">
              Doc-Q
            </Link>
          </div>
  
          {/* Navigation Links */}
          <nav className="flex gap-4">
            <Link to="/doctor" className={getLinkClass("/doctor")}>
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link to="/doctor/patients" className={getLinkClass("/doctor/patients")}>
              <Users className="h-4 w-4" />
              Patients
            </Link>
          </nav>
  
          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <LineChart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    );
  };
  
  export default DoctorNavbar;
  