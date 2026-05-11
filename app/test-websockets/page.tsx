"use client";

import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function WebSocketTestPage() {

    const [client, setClient] = useState<Client | null>(null);

    const [messages, setMessages] = useState<Array<{ sender: string; content: string; gameCode: string }>>([]);

    const [content, setContent] = useState("");

    const [connected, setConnected] = useState(false);

    const gameCode = "MEBZKH";

    useEffect(() => {

        // connexion websocket
        const socket = new SockJS("http://localhost:8080/ws-chat");

        const stompClient = new Client({

            webSocketFactory: () => socket,

            reconnectDelay: 5000,

            debug: (str) => {
                console.log(str);
            },

            onConnect: () => {

                console.log("CONNECTED");

                setConnected(true);

                // abonnement au topic
                stompClient.subscribe(
                    `/topic/game/${gameCode}`,
                    (message) => {

                        const receivedMessage = JSON.parse(message.body);

                        console.log("MESSAGE RECEIVED", receivedMessage);

                        setMessages((prev) => [
                            ...prev,
                            receivedMessage
                        ]);
                    }
                );
            },

            onStompError: (frame) => {
                console.error("STOMP ERROR", frame);
            },

            onWebSocketError: (error) => {
                console.error("WEBSOCKET ERROR", error);
            }
        });

        stompClient.activate();

        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };

    }, []);

    // envoyer message
    const sendMessage = () => {

        if (!client || !connected) {
            console.log("NOT CONNECTED");
            return;
        }

        const message = {
            sender: "Giulia",
            content: content,
            gameCode: gameCode
        };

        client.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(message)
        });

        setContent("");
    };

    return (
        <div
            style={{
                padding: "30px",
                fontFamily: "Arial"
            }}
        >

            <h1>WebSocket Chat Test</h1>

            <p>
                Status :
                {
                    connected
                        ? " Connected"
                        : " Disconnected"
                }
            </p>

            <div
                style={{
                    border: "1px solid black",
                    height: "300px",
                    overflowY: "scroll",
                    padding: "10px",
                    marginBottom: "20px"
                }}
            >

                {
                    messages.map((msg, index) => (

                        <div key={index}>
                            <strong>{msg.sender} :</strong>
                            {" "}
                            {msg.content}
                        </div>
                    ))
                }

            </div>

            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write message..."
                style={{
                    padding: "10px",
                    width: "300px",
                    marginRight: "10px"
                }}
            />

            <button
                onClick={sendMessage}
                style={{
                    padding: "10px"
                }}
            >
                Send
            </button>

        </div>
    );
}