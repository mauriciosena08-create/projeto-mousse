import { Home, Menu, ShoppingCart, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import styles from "./FigmaPage.module.css";

export function FigmaShell({ children, active }: { children: React.ReactNode; active: "home" | "cart" | "user" }) {
  return (
    <section className={`${styles.fullscreen} w-full h-full flex flex-col`}>
      <header className={styles.header}>
        <Image src={logo} alt="Infodoces" width={52} height={50} priority />
        <Link href="/menu" aria-label="Menu"><Menu /></Link>
      </header>
      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      <FigmaBottomNav active={active} />
    </section>
  );
}

export function FigmaBottomNav({ active }: { active: "home" | "cart" | "user" }) {
  return (
    <nav className={styles.bottomNav}>
      <Link href="/" className={`${styles.navButton} ${active === "home" ? "" : ""}`} aria-label="Início"><Home /></Link>
      <Link href="/carrinho" className={styles.navButton} aria-label="Carrinho"><ShoppingCart /></Link>
      <Link href="/perfil" className={styles.navButton} aria-label="Perfil"><UserRound /></Link>
    </nav>
  );
}

export function FigmaCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`${styles.card} ${className}`}>{children}</section>;
}

export { styles as figmaStyles };
