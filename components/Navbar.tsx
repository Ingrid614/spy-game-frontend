"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Nouvelle partie", href: "/new-game" },
    { name: "Règles", href: "/rules" },
    { name: "Classement", href: "/leaderboard" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Qui est l&apos;espion ?
        </Link>

        <div className={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${pathname === link.href ? styles.active : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
