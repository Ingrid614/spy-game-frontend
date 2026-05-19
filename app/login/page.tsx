"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Login.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "username" : username,
          "password" : password,
        }),
      });
      
      const data = await response.json();
      console.log("Response : ",data);

      if (!response.ok) {
        alert(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      router.push("/new-game");

    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <p className={styles.eyebrow}>Spy Game</p>

        <h1 className={styles.title}>Connexion</h1>

        <p className={styles.subtitle}>
          Connecte-toi pour rejoindre une partie ou créer ton propre lobby.
        </p>

        <form onSubmit={handleLogin} className={styles.form}>

          <div className={styles.inputGroup}>
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrer votre pseudo"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrer votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={loading}
          >
            {
              loading
                ? "Connexion..."
                : "Se connecter"
            }
          </button>

        </form>

        <p className={styles.footerText}>
          Pas encore de compte ?
          <Link href="/signup"> Créer un compte</Link>
        </p>

      </div>

    </div>
  );
}
