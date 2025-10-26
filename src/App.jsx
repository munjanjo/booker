import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "./signUpPage";
import HomePage from "./HomePage";
import LoginPage from "./loginPage";
import MainPage from "./mainPage";
import SalonPage from "./SalonPage";
import ProfessionalsPage from "./ProfessionalsPage";
import DebugToken from "./DebugToken.jsx";
import MyAppointmentsPage from "./MyAppointmentsPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/salon/:salonId" element={<SalonPage />} />
      <Route path="/professionals/:salonId" element={<ProfessionalsPage />} />
      <Route path="/debug/token" element={<DebugToken />} />
      <Route path="/my-appointments" element={<MyAppointmentsPage />} />
    </Routes>
  );
}

export default App;
