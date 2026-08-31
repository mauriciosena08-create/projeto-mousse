import Link from "next/link";

export default function Home() {
  return (
      <section className="text-center">
        <h1 className="font-bold text-2xl py-5">Ops! Você se perdeu 🍭</h1>
        <h2 className="font-medium py-3">Que tal um docinho?</h2>
        <Link href="/" className="underline">Voltar</Link>
      </section>
  );
}
