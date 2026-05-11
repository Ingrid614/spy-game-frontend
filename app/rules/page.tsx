import SectionTitle from "@/components/SectionTitle";
import StepCard from "@/components/StepCard";
import styles from "./Rules.module.css";

const rules = [
  {
    number: "01",
    title: "Mots secrets",
    text: "Les civils reçoivent un mot principal. Les espions reçoivent un mot différent mais proche pour semer le doute.",
  },
  {
    number: "02",
    title: "Un seul indice",
    text: "À tour de rôle, chaque joueur donne un mot. Il doit rester cohérent avec son mot sans être trop révélateur.",
  },
  {
    number: "03",
    title: "Vote collectif",
    text: "Après les indices, tout le monde vote pour le joueur jugé suspect. Le but est d'identifier les espions.",
  },
  {
    number: "04",
    title: "Dernière chance",
    text: "Si un espion est trouvé, il peut tenter de deviner le mot principal pour retourner la manche en sa faveur.",
  },
];

export default function RulesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <SectionTitle
          eyebrow="Règles"
          title="Comment se joue une partie ?"
          description="Spy-game est un jeu très divertissant et super intuitif"
          centered
        />

        <div className={styles.grid}>
          {rules.map((rule) => (
            <StepCard key={rule.number} {...rule} />
          ))}
        </div>
      </div>
    </div>
  );
}
