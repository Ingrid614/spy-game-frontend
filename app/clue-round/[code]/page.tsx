"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

import SectionTitle from "@/components/SectionTitle";

import GameChat from "@/components/GameChat";

import styles from "./ClueRound.module.css";

interface GameState {

  gameCode: string;

  phase: string;

  alivePlayers: string[];

  clues: Record<string,string>;

  roundNumber: number;

  winner: string | null;
}

export default function ClueRoundPage() {

  const params = useParams();

  const router = useRouter();

  const gameCode = params.code as string;

  const [state, setState] =
    useState<GameState | null>(null);

  const [client, setClient] =
    useState<Client | null>(null);

  const [connected, setConnected] =
    useState(false);

  const [clue, setClue] = useState("");

  const username =
    typeof window !== "undefined"
      ? localStorage.getItem("username")
      : null;

  useEffect(() => {

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

            const gameState =
              JSON.parse(message.body);

            setState(gameState);

            if(
              gameState.phase === "VOTING"
            ){
              router.push(`/vote/${gameCode}`);
            }

            if(
              gameState.phase === "RESULT"
            ){
              router.push(`/result/${gameCode}`);
            }
          }
        );
      }
    });

    stompClient.activate();

    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };

  }, []);

  const sendClue = async () => {

    if(!clue.trim()){
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(

        `${process.env.NEXT_PUBLIC_API_URL}/api/game/send-clue`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({

            gameCode,

            content: clue
          })
        }
      );

      const data = await response.json();

      if(!response.ok){

        alert(data.message);

        return;
      }

      setClue("");

    } catch(error){

      console.error(error);
    }
  };

  const alreadyPlayed =
    !!state?.clues?.[username || ""];

  return (

    <div className={styles.page}>

      <SectionTitle
        eyebrow="Round"
        title={`Manche ${state?.roundNumber || 1}`}
        description="Chaque joueur donne un indice."
        centered
      />

      <div className={styles.layout}>

        <div className={styles.left}>

          <div className={styles.card}>

            <h2>
              Donner un indice
            </h2>

            {
              alreadyPlayed
                ? (
                  <div className={styles.waiting}>
                    Tu as déjà joué.
                    Attends les autres joueurs.
                  </div>
                )
                : (
                  <>
                    <input
                      className={styles.input}
                      value={clue}
                      onChange={(e) =>
                        setClue(e.target.value)
                      }
                      placeholder="Votre indice..."
                    />

                    <button
                      onClick={sendClue}
                      className={styles.button}
                    >
                      Envoyer
                    </button>
                  </>
                )
            }

          </div>

          <div className={styles.card}>

            <h2>
              Indices des joueurs
            </h2>

            <div className={styles.cluesList}>

              {
                Object.entries(
                  state?.clues || {}
                ).map(([player, clue]) => (

                  <div
                    key={player}
                    className={styles.clueCard}
                  >

                    <strong>{player}</strong>

                    <p>{clue}</p>

                  </div>
                ))
              }

            </div>

          </div>

        </div>

        <div className={styles.right}>
          <GameChat gameCode={gameCode}/>
        </div>

      </div>

    </div>
  );
}