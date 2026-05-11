"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PlayerToken from "@/components/PlayerToken";
import SectionTitle from "@/components/SectionTitle";
import { useGame } from "@/context/GameContext";
import styles from "./Vote.module.css";

export default function VotePage() {
  const { players, turnIndex, settings, addVote, phase } = useGame();
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (phase === "result") {
      router.push("/round-result");
    } else if (phase === "setup") {
      router.push("/new-game");
    }
  }, [phase, router]);

  if (phase !== "vote" || players.length === 0) {
    return null;
  }

  const currentPlayer = players[turnIndex];
  // One cannot vote for themselves
  const suspects = players.filter((p) => p !== currentPlayer);

  const handleConfirmVote = () => {
    if (selectedSuspect) {
      addVote(currentPlayer, selectedSuspect);
      setSelectedSuspect(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Vote"
          title="Choisis le joueur le plus suspect"
          description="Après les indices, chacun vote. Choisi le joueur qui te semble être l'espion selon les indices."
          centered
        />

        <section className={styles.card}>
          <div className={styles.topBar}>
            <span className={styles.badge}>
              Mode : {settings.voteMode === "device" ? "vote sur l'appareil" : "vote à voix haute"}
            </span>
            <span className={styles.badge}>Votant actuel : <strong>{currentPlayer}</strong></span>
          </div>

          <div className={styles.grid}>
            {suspects.map((player) => (
              <button 
                key={player} 
                className={`${styles.voteCard} ${selectedSuspect === player ? styles.selectedVote : ""}`}
                onClick={() => setSelectedSuspect(player)}
              >
                <PlayerToken name={player} small active={selectedSuspect === player} />
                <span className={styles.voteText}>Voter contre {player}</span>
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.secondaryButton}
              onClick={() => setSelectedSuspect(null)}
              disabled={!selectedSuspect}
            >
              Annuler
            </button>
            <button 
              className={styles.primaryButton}
              onClick={handleConfirmVote}
              disabled={!selectedSuspect}
            >
              Confirmer le vote
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
