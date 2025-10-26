import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./config/firebaseConfig.js"; // ili gdje ti je firebase.js
import { useNavigate } from "react-router-dom"; // Ako koristiš react-router-dom za navigaciju
import "./auth.css"; // Uključi svoj CSS za stilizaciju
import Navbar from "./Navbar.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Ako koristiš useNavigate za preusmjeravanje
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Možeš preusmjeriti korisnika nakon login-a, npr.:
      console.log("Login successful");
      navigate("/"); // Preusmjeri na početnu stranicu ili gdje želiš
    } catch (err) {
      setError(err.message);
    }
  };
  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Login successful");
      localStorage.setItem("email", email);
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <Navbar />

      <form onSubmit={handleLogin}>
        <div className="auth-container">
          <h1>Login</h1>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="login-input"
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="changePageText">
            Don't have an account?{" "}
            <a className="changeToLoginBtn" onClick={() => navigate("/signup")}>
              Create one!
            </a>
          </p>

          <button type="submit" className="login-button">
            Login
          </button>
          <button className="google-login-button" onClick={signInWithGoogle}>
            <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "8px" }} />
            Login with Google
          </button>
        </div>
      </form>
    </>
  );
}
