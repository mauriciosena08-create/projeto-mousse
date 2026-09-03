import Image from "next/image";
import styles from "./FigmaPage.module.css";

export default function FigmaUserIcon({ size = 56 }: { size?: number }) {
  return (
    <span className={styles.userIcon} style={{ width: size, height: size }} aria-hidden="true">
      <Image src="/user.svg" alt="" width={42} height={54} className="max-w-[72%] max-h-[86%] h-auto w-auto" />
    </span>
  );
}
