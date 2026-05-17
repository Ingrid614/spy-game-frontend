"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

import SectionTitle from "@/components/SectionTitle";

import styles from "./Lobby.module.css";

interface GameState {

  gameCode: string;

  phase: string;

  status: string;

  alivePlayers: string[];

  roundNumber: number;

  winner: string | null;
}

export default function LobbyPage() {

  const params = useParams();

  const router = useRouter();

  const gameCode = params.code as string;

  const [connected, setConnected] = useState(false);

  const [loading, setLoading] = useState(false);

  const [gameState, setGameState] = useState<GameState | null>(null);

  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("username")
      : null;

    const fetchInitialGameState = async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(

        `${process.env.NEXT_PUBLIC_API_URL}/api/game/get?code=${gameCode}`,

        {
            headers: {
            Authorization: `Bearer ${token}`
            }
        }
        );
        const data = await response.json();
        console.log("INITIAL GAME", data);
        setGameState({
        gameCode,
        phase: data.status,
        alivePlayers: data.players,
        roundNumber: 0,
        winner: null,
        status: data.status,
        });

    } catch (error) {

        console.error(error);
    }
    };

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {

        router.push("/login");

        return;
    }

    // IMPORTANT
    fetchInitialGameState();

    const socket = new SockJS(
        process.env.NEXT_PUBLIC_WS_URL!
    );

    const stompClient = new Client({

        webSocketFactory: () => socket,

        reconnectDelay: 5000,

        onConnect: () => {

        setConnected(true);

        stompClient.subscribe(

            `/topic/game/${gameCode}/state`,

            (message) => {

            const state =
                JSON.parse(message.body);

            console.log(
                "GAME STATE",
                state
            );

            setGameState(state);

            if (
                state.status ===
                "IN_PROGRESS" 
            ) {

                router.push(
                `/reveal-role/${gameCode}`
                );
            }
            }
        );
        }
    });

    stompClient.activate();

    return () => {

        stompClient.deactivate();
    };

    }, [gameCode]);

  const handleStartGame = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/game/start?code=${gameCode}`,
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
          data.message || "Unable to start game"
        );

        setLoading(false);

        return;
      }
      console.log(data);

    } catch (error) {

      console.error(error);

      alert("Server error");

      setLoading(false);
    }
  };

  return (

    <div className={styles.page}>

      <div className={styles.container}>

        <SectionTitle
          eyebrow="Lobby"
          title="Salle d'attente"
          description="Attendez que tous les joueurs rejoignent la partie avant de commencer."
          centered
        />

        <div className={styles.layout}>

          <section className={styles.mainCard}>

            <div className={styles.topBar}>

              <div>

                <p className={styles.label}>
                  CODE DE PARTIE
                </p>

                <h2 className={styles.gameCode}>
                  {gameCode}
                </h2>

              </div>

              <div
                className={
                  connected
                    ? styles.connected
                    : styles.disconnected
                }
              >
                {
                  connected
                    ? "Connecté"
                    : "Déconnecté"
                }
              </div>

            </div>

            <div className={styles.playersBlock}>

              <div className={styles.playersHeader}>

                <h3>
                  Joueurs connectés
                </h3>

                <span>
                  {
                    gameState?.alivePlayers
                      ?.length || 0
                  } joueurs
                </span>

              </div>

              <div className={styles.playersList}>

                {
                  gameState?.alivePlayers
                    ?.map((player) => (

                      <div
                        key={player}
                        className={styles.playerCard}
                      >

                        <div
                          className={styles.avatar}
                        >
                          {
                            player
                              .charAt(0)
                              .toUpperCase()
                          }
                        </div>

                        <div>

                          <p
                            className={
                              styles.playerName
                            }
                          >
                            {player}
                          </p>

                          {
                            player === username && (
                              <span
                                className={
                                  styles.youBadge
                                }
                              >
                                Toi
                              </span>
                            )
                          }

                        </div>

                      </div>
                    ))
                }

              </div>

            </div>

            <button
              className={styles.startButton}
              disabled={
                (gameState?.alivePlayers
                  ?.length || 0) < 2 || loading
              }
              onClick={handleStartGame}
            >

              {
                loading
                  ? (
                    <div
                      className={
                        styles.loader
                      }
                    ></div>
                  )
                  : "Commencer la partie"
              }

            </button>

            {
              (gameState?.alivePlayers
                ?.length || 0) < 3 && (

                <p className={styles.warning}>

                  Il faut au moins
                  3 joueurs pour démarrer.

                </p>
              )
            }

          </section>

          <aside className={styles.sideCard}>

            <h3 className={styles.sideTitle}>
              Comment jouer ?
            </h3>

            <div className={styles.rule}>

              Chaque joueur reçoit
              un mot secret.

            </div>

            <div className={styles.rule}>

              Les espions ont un mot
              différent des civils.

            </div>

            <div className={styles.rule}>

              Donnez des indices pour
              trouver les espions.

            </div>

            <div className={styles.rule}>

              Votez à chaque manche
              pour éliminer un joueur.

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}