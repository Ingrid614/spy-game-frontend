import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import styles from "./RoundResult.module.css";

export default function RoundResultPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Résultat"
          title="Fin de la manche"
          description="Cette page résume le vote, l'identité du joueur éliminé et le gagnant du round."
          centered
        />

        <section className={styles.card}>
          <div className={styles.resultBanner}>Hamza a été éliminé</div>
          <div className={styles.grid}>
            <div className={styles.infoBlock}>
              <p className={styles.label}>Rôle révélé</p>
              <p className={styles.value}>Espion</p>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.label}>Mot des civils</p>
              <p className={styles.value}>Plage</p>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.label}>Mot des espions</p>
              <p className={styles.value}>Désert</p>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.label}>Gagnants</p>
              <p className={styles.value}>Les civils</p>
            </div>
          </div>

          <div className={styles.actions}>
            <Link href="/new-game" className={styles.secondaryButton}>Rejouer</Link>
            <Link href="/leaderboard" className={styles.primaryButton}>Voir le classement</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
