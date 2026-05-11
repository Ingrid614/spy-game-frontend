"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlayerToken from "@/components/PlayerToken";
import SectionTitle from "@/components/SectionTitle";
import { useGame } from "@/context/GameContext";
import styles from "./ClueRound.module.css";

export default function ClueRoundPage() {
  const { players, turnIndex, clues, addClue, phase } = useGame();
  const [currentClue, setCurrentClue] = useState("");
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (phase === "vote") {
      router.push("/vote");
    } else if (phase === "setup") {
      router.push("/new-game");
    }
  }, [phase, router]);

  if (phase !== "clues" || players.length === 0) {
    return null;
  }
  useEffect(() => {

    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      router.push("/login");
      return;
    }

    setAuthorized(true);

  }, []);

  const currentPlayer = players[turnIndex];

  const handleSubmitClue = () => {
    if (currentClue.trim()) {
      addClue(currentPlayer, currentClue.trim());
      setCurrentClue("");
    }
  };
  if (!authorized) {
    return null;
  }
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Phase d'indices"
          title="Tout le monde donne un seul mot"
          description="Le but est de rester cohérent avec son mot sans être trop évident. Les indices déjà donnés aident à repérer les contradictions."
        />

        <div className={styles.layout}>
          <section className={styles.mainCard}>
            <div className={styles.statusBar}>
              <span className={styles.status}>Tour du joueur : <strong>{currentPlayer}</strong></span>
              <span className={styles.round}>Manche 1</span>
            </div>

            <div className={styles.turnCard}>
              <h3 className={styles.turnTitle}>À toi de jouer, {currentPlayer}</h3>
              <p className={styles.turnText}>
                Donne un seul mot-indice. Il doit aider les autres civils sans révéler trop clairement ton mot.
              </p>
              <input 
                className={styles.input} 
                placeholder="Écris ton indice" 
                value={currentClue}
                onChange={(e) => setCurrentClue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitClue()}
              />
              <button className={styles.primaryButton} onClick={handleSubmitClue}>
                Valider l&apos;indice
              </button>
            </div>

            <div className={styles.historyBlock}>
              <h3 className={styles.blockTitle}>Indices déjà donnés</h3>
              <div className={styles.cluesList}>
                {Object.entries(clues).length === 0 ? (
                  <p className={styles.emptyState}>Aucun indice donné pour le moment.</p>
                ) : (
                  Object.entries(clues).map(([player, clue]) => (
                    <div key={player} className={styles.clueRow}>
                      <span className={styles.cluePlayer}>{player}</span>
                      <span className={styles.clueWord}>{clue}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className={styles.sideCard}>
            <h3 className={styles.blockTitle}>Ordre des joueurs</h3>
            <div className={styles.playersColumn}>
              {players.map((player, index) => (
                <PlayerToken 
                  key={player} 
                  name={player} 
                  active={index === turnIndex} 
                  completed={index < turnIndex}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
