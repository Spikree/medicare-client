import { LoginForm } from "@/components/Login";
import { SignupForm } from "@/components/Signup";
import { useState } from "react";

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="p-8 min-h-max">
      {showLogin ? (
        <LoginForm setShowLogin={setShowLogin} />
      ) : (
        <SignupForm setShowLogin={setShowLogin} />
      )}
    </div>
  );
};

export default Auth;
