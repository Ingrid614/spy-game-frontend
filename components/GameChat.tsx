"use client";

import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import styles from "./GameChat.module.css";

interface Message {
  sender: string;
  content: string;
  gameCode: string;
}

interface Props {
  gameCode: string;
}

export default function GameChat({ gameCode }: Props) {

  const [client, setClient] = useState<Client | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [content, setContent] = useState("");

  const [connected, setConnected] = useState(false);

  useEffect(() => {

    const socket = new SockJS("http://localhost:8080/ws-chat");

    const stompClient = new Client({

      webSocketFactory: () => socket,

      reconnectDelay: 5000,

      onConnect: () => {

        setConnected(true);

        stompClient.subscribe(
          `/topic/game/${gameCode}`,
          (message) => {

            const receivedMessage = JSON.parse(message.body);

            setMessages((prev) => [
              ...prev,
              receivedMessage
            ]);
          }
        );
        stompClient.subscribe(
          `/topic/game/${gameCode}/state`,
          (message) => {

            const receivedMessage = JSON.parse(message.body);

            setMessages((prev) => [
              ...prev,
              receivedMessage
            ]);
          }
        );
      }
    });

    stompClient.activate();

    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };

  }, [gameCode]);

  const sendMessage = () => {

    if (!client || !connected || !content.trim()) {
      return;
    }

    const username = localStorage.getItem("username");

    const message = {
      sender: username || "Anonymous",
      content,
      gameCode
    };

    client.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(message)
    });

    setContent("");
  };

  return (
    <div className={styles.chatContainer}>

      <div className={styles.chatHeader}>
        Chat de la partie
      </div>

      <div className={styles.messages}>

        {
          messages.map((msg, index) => (

            <div
              key={index}
              className={styles.message}
            >
              <strong>{msg.sender}</strong>
              <p>{msg.content}</p>
            </div>
          ))
        }

      </div>

      <div className={styles.inputArea}>

        <input
          type="text"
          placeholder="Envoyer un message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
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