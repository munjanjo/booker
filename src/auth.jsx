import { auth, googleProvider } from "./config/firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function Auth() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const signIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      console.log("User created and profile updated successfully");
      localStorage.setItem("fullName", fullName);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.error("Email already in use. Please log in instead.");
      } else {
        console.error("Error creating user:", error);
      }
    }
  };
  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("User created successfully");
      localStorage.setItem("email", email);
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <>
      <div className="auth-container">
        <h1 className="auth-title">Sign up</h1>
        <input
          type="text"
          placeholder="Full Name"
          className="login-input"
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="changePageText">
          Already have an account?{" "}
          <a className="changeToLoginBtn" onClick={() => navigate("/login")}>
            Login!
          </a>
        </p>
        <button className="login-button" onClick={signIn}>
          Sign Up
        </button>
        <button className="google-login-button" onClick={signInWithGoogle}>
          <FontAwesomeIcon icon={faGoogle} style={{ marginRight: "8px" }} />
          Sign in with Google
        </button>
      </div>
    </>
  );
}
