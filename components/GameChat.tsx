"use client";

import { useEffect, useState } from "react";

import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

import styles from "./GameChat.module.css";

interface Message {

  sender: string;

  content: string;

  sentAt?: string;
}

interface Props {

  gameCode: string;
}

export default function GameChat({
  gameCode
}: Props) {

  const [client, setClient] =
    useState<Client | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [content, setContent] =
    useState("");

  const [connected, setConnected] =
    useState(false);

  // HISTORY + WEBSOCKET
  useEffect(() => {

    const token =
      localStorage.getItem("token");

    // LOAD HISTORY

    const fetchHistory = async () => {

      try {

        const response = await fetch(

          `${process.env.NEXT_PUBLIC_API_URL}/api/game/history?code=${gameCode}`,

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        setMessages(data);

      } catch (error) {

        console.error(
          "History error",
          error
        );
      }
    };

    fetchHistory();

    // WEBSOCKET

    const socket = new SockJS(
      process.env.NEXT_PUBLIC_WS_URL!
    );

    const stompClient = new Client({

      webSocketFactory: () => socket,

      reconnectDelay: 5000,

      onConnect: () => {

        setConnected(true);

        stompClient.subscribe(

          `/topic/game/${gameCode}`,

          (message) => {

            const receivedMessage =
              JSON.parse(message.body);

            setMessages((prev) => [

              ...prev,

              receivedMessage
            ]);
          }
        );
      },

      onStompError: (frame) => {

        console.error(
          "STOMP ERROR",
          frame
        );
      },

      onWebSocketError: (error) => {

        console.error(
          "WEBSOCKET ERROR",
          error
        );
      }
    });

    stompClient.activate();

    setClient(stompClient);

    return () => {

      stompClient.deactivate();
    };

  }, [gameCode]);

  // SEND MESSAGE

  const sendMessage = () => {

    if (
      !client ||
      !connected ||
      !content.trim()
    ) {
      return;
    }

    const username =
      localStorage.getItem("username");

    const message = {

      sender:
        username || "Anonymous",

      content,

      gameCode
    };

    client.publish({

      destination:
        "/app/chat.sendMessage",

      body: JSON.stringify(message)
    });

    setContent("");
  };

  return (

    <div className={styles.chatContainer}>

      <div className={styles.chatHeader}>

        <div>
          Chat de la partie
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
              : "Hors ligne"
          }
        </div>

      </div>

      <div className={styles.messages}>

        {
          messages.length === 0
            ? (
              <div className={styles.empty}>

                Aucun message

              </div>
            )
            : (
              messages.map(
                (msg, index) => (

                  <div
                    key={index}
                    className={styles.message}
                  >

                    <div
                      className={
                        styles.messageTop
                      }
                    >

                      <strong>
                        {msg.sender}
                      </strong>

                    </div>

                    <p>
                      {msg.content}
                    </p>

                  </div>
                )
              )
            )
        }

      </div>

      <div className={styles.inputArea}>

        <input

          type="text"

          placeholder="Envoyer un message..."

          value={content}

          onChange={(e) =>
            setContent(
              e.target.value
            )
          }

          onKeyDown={(e) =>
            e.key === "Enter" &&
            sendMessage()
          }

          className={styles.input}
        />

        <button

          onClick={sendMessage}

          className={styles.sendButton}
        >

          Envoyer

        </button>

      </div>

    </div>
  );
}