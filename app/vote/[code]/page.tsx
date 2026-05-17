"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

import GameChat from "@/components/GameChat";

import SectionTitle from "@/components/SectionTitle";

import styles from "./Vote.module.css";

interface GameState {

  gameCode: string;

  phase: string;

  status: string;

  alivePlayers: string[];

  roundNumber: number;

  winner: string | null;
}


export default function VotePage(){

  const params = useParams();

  const router = useRouter();

  const gameCode = params.code as string;

  const [selected,setSelected] =
    useState<string | null>(null);

  const [gameState, setGameState] = useState<GameState | null>(null);

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

    // IMPORTANT
    fetchInitialGameState();

    const socket = new SockJS(
      process.env.NEXT_PUBLIC_WS_URL!
    );

    const stompClient = new Client({

      webSocketFactory: () => socket,

      reconnectDelay: 5000,

      onConnect: () => {

        stompClient.subscribe(

          `/topic/game/${gameCode}/state`,

          (message) => {

            const state = JSON.parse(message.body);

            console.log("STATE :", state);

            setGameState(state);

            if(
              state.phase === "RESULT"
            ){

              router.push(
                `/result/${gameCode}`
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

  }, []);

  const vote = async () => {

    if(!selected){
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      await fetch(

        `${process.env.NEXT_PUBLIC_API_URL}/api/game/vote`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({

            gameCode,

            targetUsername: selected
          })
        }
      );

    } catch(error){

      console.error(error);
    }
  };

  return (

    <div className={styles.page}>

      <SectionTitle
        eyebrow="Vote"
        title="Qui est l'espion ?"
        description="Votez contre le joueur suspect."
        centered
      />

      <div className={styles.layout}>

        <div className={styles.left}>

          <div className={styles.card}>

            {
              (gameState?.alivePlayers || []).map(player => (

                <button
                  key={player}
                  className={`${styles.playerButton} ${
                    selected === player
                      ? styles.selectedPlayer
                      : ""
                  }`}
                  onClick={() => setSelected(player)}
                >
                  {player}
                </button>
              ))
            }

            <button
              className={styles.voteButton}
              onClick={vote}
            >
              Confirmer le vote
            </button>

          </div>

        </div>

        <div className={styles.right}>
          <GameChat gameCode={gameCode}/>
        </div>

      </div>

    </div>
  );
}