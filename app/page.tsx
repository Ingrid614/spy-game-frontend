"use client"
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import StepCard from "@/components/StepCard";
import styles from "./Home.module.css";
import { useEffect } from "react";

const steps = [
  {
    number: "01",
    title: "Crée ta partie",
    text: "Ajoute les joueurs, choisis le nombre d'espions, la catégorie de mots et les options du vote.",
  },
  {
    number: "02",
    title: "Fais passer le téléphone",
    text: "Chaque joueur découvre son rôle en secret. Les civils voient le mot principal, les espions un mot différent.",
  },
  {
    number: "03",
    title: "Indice puis vote",
    text: "Tout le monde donne un seul mot-indice. Ensuite le groupe vote pour tenter de démasquer les espions.",
  },
];

export default function Home() {
  useEffect(() => {
  
      localStorage.clear();
  
    }, []);
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Jeu local • 1 téléphone • plusieurs joueurs</p>
          <h1 className={styles.title}>Qui est l&apos;espion ?</h1>
          <p className={styles.subtitle}>
            Prépare une partie en quelques secondes, distribue les rôles secrètement,
            enchaîne les indices et laisse le vote révéler les imposteurs.
          </p>

          <div className={styles.actions}>
            <Link href="/login" className={styles.primaryButton}>
              Connecte-toi
            </Link>
            <Link href="/rules" className={styles.secondaryButton}>
              Voir les règles
            </Link>
          </div>
        </div>

        <div className={styles.previewCard}>
          <span className={styles.previewBadge}>Aperçu d&apos;une manche</span>
          <div className={styles.previewLine}><strong>Mot des civils :</strong> Plage</div>
          <div className={styles.previewLine}><strong>Mot des espions :</strong> Désert</div>
          <div className={styles.previewLine}><strong>Phase actuelle :</strong> Révélation secrète</div>
          <div className={styles.previewHint}>Un mot proche pour créer le doute, puis un vote pour trancher.</div>
        </div>
      </section>

      <section className={styles.section}>
        <SectionTitle
          eyebrow="Déroulement"
          title="Une logique de jeu simple et fluide"
          description="Le frontend doit suivre le rythme réel d'une partie locale : configuration, révélation, indices, vote et résultat."
          centered
        />

        <div className={styles.grid}>
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </section>
    </div>
  );
}
