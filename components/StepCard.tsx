import styles from "./StepCard.module.css";

type Props = {
  number: string;
  title: string;
  text: string;
};

export default function StepCard({ number, title, text }: Props) {
  return (
    <article className={styles.card}>
      <span className={styles.badge}>{number}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </article>
  );
}
