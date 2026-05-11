"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import { useGame } from "@/context/GameContext";
import styles from "./NewGame.module.css";
import { Category } from "@/utils/gameLogic";

export default function NewGamePage() {
  const { players, addPlayer, removePlayer, settings, updateSettings, startGame } = useGame();
  const [newPlayerName, setNewPlayerName] = useState("");
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      router.push("/login");
      return;
    }

    setAuthorized(true);

  }, []);

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName);
      setNewPlayerName("");
    }
  };

  const handleLaunch = () => {
    if (players.length < 4) {
      alert("Il faut au moins 4 joueurs pour lancer la partie.");
      return;
    }
    startGame();
    router.push("/reveal-role");
  };

  if (!authorized) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Configuration"
          title="Préparer une nouvelle partie"
          description="Cette page rassemble tout ce qu'il faut avant de commencer : joueurs, espions, catégories de mots et mode de vote."
        />

        <div className={styles.layout}>
          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>Joueurs ({players.length})</h3>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Nom du joueur</label>
              <div className={styles.inlineForm}>
                <input 
                  className={styles.input} 
                  placeholder="Ajouter un joueur" 
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                />
                <button className={styles.actionButton} onClick={handleAddPlayer}>Ajouter</button>
              </div>
            </div>

            <div className={styles.playersList}>
              {players.map((player) => (
                <div key={player} className={styles.playerRow}>
                  <span>{player}</span>
                  <button className={styles.removeButton} onClick={() => removePlayer(player)}>Retirer</button>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.panel}>
            <h3 className={styles.panelTitle}>Options de la partie</h3>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Nombre d&apos;espions</label>
              <select 
                className={styles.select} 
                value={settings.spyCount}
                onChange={(e) => updateSettings({ spyCount: parseInt(e.target.value) })}
              >
                <option value="1">1 espion</option>
                <option value="2">2 espions</option>
                <option value="3">3 espions</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Catégorie</label>
              <select 
                className={styles.select} 
                value={settings.category}
                onChange={(e) => updateSettings({ category: e.target.value as Category })}
              >
                <option value="lieux">Lieux</option>
                <option value="objets">Objets</option>
                <option value="metiers">Métiers</option>
                <option value="animaux">Animaux</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Mode de vote</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioCard}>
                  <input 
                    type="radio" 
                    name="vote" 
                    checked={settings.voteMode === "device"}
                    onChange={() => updateSettings({ voteMode: "device" })}
                  /> 
                  Vote sur votre appareil
                </label>
                <label className={styles.radioCard}>
                  <input 
                    type="radio" 
                    name="vote" 
                    checked={settings.voteMode === "voice"}
                    onChange={() => updateSettings({ voteMode: "voice" })}
                  /> 
                  Vote à voix haute
                </label>
              </div>
            </div>

            <div className={styles.summary}>
              <p><strong>Joueurs :</strong> {players.length}</p>
              <p><strong>Espions :</strong> {settings.spyCount}</p>
              <p><strong>Minimum conseillé :</strong> 4 à 8 joueurs</p>
            </div>

            <button onClick={handleLaunch} className={styles.launchButton}>
              Lancer la partie
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
