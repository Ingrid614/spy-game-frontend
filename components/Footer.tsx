import styles from "./Footer.module.css";
import { FaEnvelope, FaPhoneAlt, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3 className={styles.title}>Let&apos;s Play Together</h3>

          <div className={styles.contactItem}>
            <FaEnvelope className={styles.icon} />
            <a
              href="mailto:yvesarthur.negoumwouatedem@etu.toulouse-inp.fr"
              className={styles.link}
            >
              yvesarthur.negoumwouatedem@etu.toulouse-inp.fr
            </a>
          </div>

          <div className={styles.contactItem}>
            <FaPhoneAlt className={styles.icon} />
            <a href="tel:+33759043831" className={styles.link}>
              +33 7 59 04 38 31
            </a>
          </div>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>Follow Us</h3>

          <div className={styles.socials}>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>À propos du jeu</h3>
          <p className={styles.text}>
            Un jeu de bluff et de déduction où chacun donne un indice,
            soupçonne les autres et tente de démasquer l&apos;espion avant la fin du tour.
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 Qui est l&apos;espion ? Tous droits réservés.</p>
      </div>
    </footer>
  );
}
