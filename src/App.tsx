import Auth from "./pages/auth";
import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
};

export default App;
