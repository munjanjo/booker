import "./App.css";
import Navbar from "./Navbar";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const fullText = "Why call? Just click.";
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  return (
    <>
      <title>Booker</title>
      <h1 className="typing-text">
        {text}
        <span className="cursor">|</span>
      </h1>
      <Navbar />
      <div className="search-container">
        <input
          type="text"
          placeholder="Barbershop"
          className="search-parameter"
        />
        <input
          type="text"
          placeholder="Location"
          className="search-parameter"
        />

        <input type="date" placeholder="Date" className="search-parameter" />
        <input type="time" placeholder="Time" className="search-parameter" />
        <button className="search-button" onClick={() => navigate("/main")}>
          Search
        </button>
      </div>
    </>
  );
}
