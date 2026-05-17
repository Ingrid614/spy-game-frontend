"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import SectionTitle from "@/components/SectionTitle";

import styles from "./NewGame.module.css";

interface WaitingGame {

  code: string;

  host: string;

  players: number;
}

export default function NewGamePage() {

  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);

  const [loading, setLoading] = useState(false);

  const [joiningGame, setJoiningGame] =
    useState<string | null>(null);

  const [waitingGames, setWaitingGames] =
    useState<WaitingGame[]>([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

      router.push("/login");

      return;
    }

    setAuthorized(true);

    fetchWaitingGames();

  }, []);

  const fetchWaitingGames = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/waiting`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        console.error(data);

        return;
      }

      setWaitingGames(data);

    } catch (error) {

      console.error(error);
    }
  };

  const handleCreateGame = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/create`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {

        alert(
          data.message ||
          "Unable to create game"
        );

        setLoading(false);

        return;
      }

      router.push(`/lobby/${data.code}`);

    } catch (error) {

      console.error(error);

      alert("Server error");

      setLoading(false);
    }
  };

  const handleJoinGame = async (
    code: string
  ) => {

    try {

      setJoiningGame(code);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/game/join?code=${code}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {

        alert(
          data.message ||
          "Unable to join game"
        );

        setJoiningGame(null);

        return;
      }

      router.push(`/lobby/${code}`);

    } catch (error) {

      console.error(error);

      alert("Server error");

      setJoiningGame(null);
    }
  };

  if (!authorized) {

    return null;
  }

  return (

    <div className={styles.page}>

      <div className={styles.container}>

        <SectionTitle
          eyebrow="Multijoueur"
          title="Créer ou rejoindre une partie"
          description="Lance une nouvelle partie ou rejoins un lobby existant avec d'autres joueurs."
          centered
        />

        <div className={styles.layout}>

          {/* CREATE GAME */}

          <section className={styles.createCard}>

            <span className={styles.badge}>
              Temps réel
            </span>

            <h2 className={styles.heroTitle}>
              Créer une nouvelle partie
            </h2>

            <p className={styles.heroText}>
              Deviens host de la partie,
              invite des joueurs et démarre
              la session quand tout le monde
              est prêt.
            </p>

            <button
              className={styles.createButton}
              onClick={handleCreateGame}
              disabled={loading}
            >

              {
                loading
                  ? (
                    <div
                      className={styles.loader}
                    ></div>
                  )
                  : "Créer une partie"
              }

            </button>

          </section>

          {/* WAITING GAMES */}

          <section className={styles.gamesCard}>

            <div className={styles.gamesHeader}>

              <h2 className={styles.gamesTitle}>
                Parties disponibles
              </h2>

              <button
                className={styles.refreshButton}
                onClick={fetchWaitingGames}
              >
                Actualiser
              </button>

            </div>

            {
              waitingGames.length === 0
                ? (
                  <div className={styles.emptyState}>

                    Aucune partie en attente.

                  </div>
                )
                : (
                  <div className={styles.gamesList}>

                    {
                      waitingGames.map((game) => (

                        <div
                          key={game.code}
                          className={styles.gameRow}
                        >
                          <div>
                            <p className={styles.code}>
                              {game.code}
                            </p>
                            <p className={styles.host}>
                              Host : {game.host}
                            </p>
                          </div>
                          <div
                            className={
                              styles.rightBlock
                            }
                          >
                            <span
                              className={
                                styles.playerCount
                              }
                            >
                              {game.players} joueurs
                            </span>

                            <button
                              className={
                                styles.joinButton
                              }
                              onClick={() =>
                                handleJoinGame(
                                  game.code
                                )
                              }
                              disabled={
                                joiningGame ===
                                game.code
                              }
                            >
                              {
                                joiningGame ===
                                game.code
                                  ? (
                                    <div
                                      className={
                                        styles.smallLoader
                                      }
                                    ></div>
                                  )
                                  : "Rejoindre"
                              }
                            </button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )
            }
          </section>
        </div>
      </div>
    </div>
  );
}