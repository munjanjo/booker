import "./Navbar.css";
import Logo from "./assets/logo.png";
import { useNavigate } from "react-router-dom";
import { signOut as firebaseSignOut, updateProfile } from "firebase/auth";
import { auth } from "./config/firebaseConfig.js";

export default function Navbar() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const fullName = user ? user.displayName : "Guest";
  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = async () => {
    try {
      await firebaseSignOut(auth);
      alert("User signed out successfully");
      navigate("/"); // Preusmjeri korisnika na početnu stranicu
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img
          src={Logo}
          alt="Logo"
          className="navbar-logo"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="navbar-right">
        {user ? (
          <p className="navbar-title" onClick={() => navigate("/profile")}>
            {fullName}
          </p>
        ) : (
          <p className="navbar-title" onClick={handleLoginClick}>
            Login
          </p>
        )}
        {user ? (
          <p
            className="navbar-title"
            onClick={() => navigate("/my-appointments")}
          >
            My Appointments
          </p>
        ) : (
          ""
        )}
        <p className="navbar-title" onClick={handleLogoutClick}>
          Logout
        </p>
        <p className="navbar-title">Add a business</p>
      </div>
    </div>
  );
}
