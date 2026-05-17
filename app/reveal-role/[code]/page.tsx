"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SectionTitle from "@/components/SectionTitle";
import styles from "./RevealRole.module.css";
import GameChat from "@/components/GameChat";
import { useParams } from "next/navigation";

export default function RevealRolePage() {

  const router = useRouter();

  const [role, setRole] = useState("");
  const [word, setWord] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const params = useParams();

  const gameCode = params.code as string;

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/game/my-role?code=${gameCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setRole(data.role);
        setWord(data.word);
      });
    
      console.log(role,word);

  }, []);

  return (
    <div className={styles.page}>
      <SectionTitle
            eyebrow="Rôle secret"
            title="Découvre ton identité"
            description="Personne ne doit voir ton écran."
            centered
          />

      <div className={styles.layout}>


        <div className={styles.left}>
          <div className={styles.roleCard}>

            <div className={styles.topBar}>
              <span className={styles.playerBadge}>
                {username}
              </span>
            </div>

            {
              revealed
                ? (
                  <>

                    <div className={styles.roleBlock}>

                      <p className={styles.label}>
                        TON RÔLE
                      </p>

                      <h2 className={styles.role}>
                        {role}
                      </h2>

                    </div>

                    <div className={styles.wordBlock}>

                      <p className={styles.label}>
                        TON MOT
                      </p>

                      <div className={styles.wordCard}>
                        {word}
                      </div>

                    </div>

                  </>
                )
                : (
                  <div className={styles.hiddenState}>
                    Ton rôle est caché
                  </div>
                )
            }

            <button
              className={styles.primaryButton}
              onClick={() => {
                if(!revealed){
                    setRevealed(true);
                    return;
                }
                router.push(`/clue-round/${gameCode}`);
              }}
            >
              {
                revealed
                  ? "Commencer à jouer"
                  : "Voir mon rôle"
              }
            </button>

          </div>

        </div>
        <div className={styles.right}>
          <GameChat gameCode={gameCode} />
        </div>

      </div>

    </div>
  );
}