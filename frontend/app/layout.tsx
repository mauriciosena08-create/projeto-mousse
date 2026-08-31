import type { Metadata } from "next";
import { Gothic_A1 } from "next/font/google";

import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GothicA1 = Gothic_A1({
  variable: "--font-gothic-a1",
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

export const metadata: Metadata = {
  title: "Infodoces — O mais gostosos do IF",
  description: "Bateu aquela fome entre uma aula e outra? A Infodoces chegou pra salvar! 😎",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${GothicA1.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex flex-1 text-white items-center justify-center">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
