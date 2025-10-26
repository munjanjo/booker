import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
// 👇 koristi isti auth kao i u auth.jsx
import { auth } from "./config/firebaseConfig.js";

export default function DebugToken() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState("Provjeravam prijavu...");

  useEffect(() => {
    // Pričekaj da se Firebase Auth inicijalizira i javi korisnika
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserInfo("Nisi ulogiran 😕");
        setToken("");
        return;
      }
      // Prikaži tko je ulogiran
      setUserInfo(user.email || user.displayName || user.uid);
      // Uzmi svježi ID token
      try {
        const idToken = await user.getIdToken(/* forceRefresh */ true);
        setToken(idToken);
        console.log("Firebase ID token:", idToken);
      } catch (err) {
        console.error("Greška pri dohvaćanju tokena:", err);
        setToken("Greška pri dohvaćanju tokena 😕");
      }
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Firebase ID Token</h2>
      <p>
        <b>Korisnik:</b> {userInfo}
      </p>
      <textarea
        readOnly
        rows={8}
        style={{ width: "100%", fontFamily: "monospace" }}
        value={token}
      />
    </div>
  );
}
