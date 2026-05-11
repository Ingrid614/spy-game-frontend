import SectionTitle from "@/components/SectionTitle";
import styles from "./SpyGuess.module.css";

export default function SpyGuessPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Dernière chance"
          title="L'espion tente de deviner le mot"
          description="Si l'espion est découvert, il peut encore sauver la manche en trouvant le mot principal des civils."
          centered
        />

        <section className={styles.card}>
          <p className={styles.highlight}>Espion éliminé : Hamza</p>
          <p className={styles.text}>
            Entre ici le mot que tu penses être celui des civils. Si la réponse est correcte,
            l&apos;espion remporte quand même la manche.
          </p>

          <input className={styles.input} placeholder="Écris le mot des civils" />

          <div className={styles.actions}>
            <button className={styles.secondaryButton}>Je passe</button>
            <button className={styles.primaryButton}>Valider la réponse</button>
          </div>
        </section>
      </div>
    </div>
  );
}
