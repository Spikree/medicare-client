import { LoginForm } from "@/components/Login";
import { SignupForm } from "@/components/Signup";
import { useState } from "react";

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);

  return showLogin ? (
    <LoginForm setShowLogin={setShowLogin} />
  ) : (
    <SignupForm setShowLogin={setShowLogin} />
  );
};

export default Auth;
