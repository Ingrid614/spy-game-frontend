import SectionTitle from "@/components/SectionTitle";
import styles from "./Contact.module.css";

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Contact"
          title="Une question sur le projet ?"
          description="Page simple pour garder la cohérence avec ta navigation actuelle."
          centered
        />

        <section className={styles.card}>
          <div className={styles.field}>
            <label className={styles.label}>Nom</label>
            <input className={styles.input} placeholder="Ton nom" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} placeholder="Ton email" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Message</label>
            <textarea className={styles.textarea} placeholder="Ton message" rows={6} />
          </div>

          <button className={styles.button}>Envoyer</button>
        </section>
      </div>
    </div>
  );
}
