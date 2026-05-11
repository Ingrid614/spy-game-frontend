import SectionTitle from "@/components/SectionTitle";
import styles from "./Leaderboard.module.css";

const ranking = [
  { name: "Arthur", score: 18, role: "Civil" },
  { name: "Ingrid", score: 15, role: "Espion" },
  { name: "Giulia", score: 13, role: "Civil" },
  { name: "Hamza", score: 11, role: "Espion" },
];

export default function LeaderboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Classement"
          title="Les meilleurs joueurs"
          description="Cette page est facultative pour la première version, mais elle donne une suite logique après les manches."
        />

        <div className={styles.tableCard}>
          <div className={styles.headerRow}>
            <span>Joueur</span>
            <span>Points</span>
            <span>Spécialité</span>
          </div>

          {ranking.map((player, index) => (
            <div key={player.name} className={styles.row}>
              <span>{index + 1}. {player.name}</span>
              <span>{player.score}</span>
              <span>{player.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
