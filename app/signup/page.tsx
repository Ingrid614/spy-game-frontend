"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Signup.module.css";

export default function SignupPage() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Account created successfully");

      console.log(data);

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };
  
  return (
    <div className={styles.page}>

      <div className={styles.card}>

        <p className={styles.eyebrow}>Spy Game</p>

        <h1 className={styles.title}>Créer un compte</h1>

        <p className={styles.subtitle}>
          Rejoins le jeu et commence à créer des parties multijoueur.
        </p>

        <form onSubmit={handleSignup} className={styles.form}>

          <div className={styles.inputGroup}>
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choisir un pseudo"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Créer un mot de passe"
              required
            />
          </div>

          <button type="submit" className={styles.primaryButton}>
            Créer un compte
          </button>

        </form>

        <p className={styles.footerText}>
          Déjà un compte ?
          <Link href="/login"> Se connecter</Link>
        </p>

      </div>

    </div>
  );
}