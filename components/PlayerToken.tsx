import styles from "./PlayerToken.module.css";

type Props = {
  name: string;
  active?: boolean;
  completed?: boolean;
  small?: boolean;
};

export default function PlayerToken({ name, active = false, completed = false, small = false }: Props) {
  return (
    <div className={`${styles.token} ${active ? styles.active : ""} ${completed ? styles.completed : ""} ${small ? styles.small : ""}`}>
      <span className={styles.dot} />
      <span>{name}</span>
    </div>
  );
}
