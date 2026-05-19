"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

import SectionTitle from "@/components/SectionTitle";

import GameChat from "@/components/GameChat";

import styles from "./Result.module.css";

interface GameState {

  gameCode: string;

  phase: string;

  alivePlayers: string[];

  clues: Record<string,string>;

  votes: Record<string,number>;

  roundNumber: number;

  eliminatedPlayer: string | null;

  winner: string | null;

  status: string;
}
export default function ResultPage(){

  const params = useParams();

  const router = useRouter();

  const gameCode = params.code as string;

  const [state,setState] =
    useState<GameState | null>(null);
  
  const fetchInitialState = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(

        `${process.env.NEXT_PUBLIC_API_URL}/api/game/get?code=${gameCode}`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      console.log(
              "INITAL STATE",
              data
            );

      setState(data);

    } catch(error){

      console.error(error);
    }
  };

  useEffect(() => {

    fetchInitialState();

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

            const gameState =
              JSON.parse(message.body);

            setState(gameState);

            if(
              gameState.phase === "DESCRIPTION"
            ){

              setTimeout(() => {

                router.push(
                  `/clue-round/${gameCode}`
                );

              },3000);
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

  return (
    <div className={styles.page}>
      <SectionTitle
        eyebrow="Résultat"
        title={
          state?.winner
            ? "Fin de partie"
            : "Joueur éliminé"
        }
        description=""
        centered
      />

      <div className={styles.layout}>

        <div className={styles.left}>

          <div className={styles.card}>

            {
              state?.winner
                ? (
                  <>
                    <h2>
                      {
                        state.winner ===
                        "SPIES"
                        ? "Les espions gagnent"
                        : "Les civils gagnent"
                      }
                    </h2>
                    <button
                      onClick={() =>
                        router.push("/new-game")
                      }
                      className={styles.button}
                    >
                      Retour accueil
                    </button>
                  </>
                )
                : (
                  <>
                    <h2>
                      Joueur éliminé
                    </h2>
                    <p>
                      {
                        state?.eliminatedPlayer
                      }
                    </p>
                    <p>
                      Manche suivante...
                    </p>
                  </>
                )
            }
          </div>
        </div>
        <div className={styles.right}>
          <GameChat gameCode={gameCode}/>
        </div>
      </div>
    </div>
  );
}