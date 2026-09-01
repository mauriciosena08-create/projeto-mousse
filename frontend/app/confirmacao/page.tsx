"use client";

import Product from "@/components/Product";
import { Check } from "lucide-react";
import { useCarrinho } from "@/lib/atoms/carrinhoAtom";
import Link from "next/link";

export default function Confirmacao() {
  const { carrinho } = useCarrinho();

  return (
    <section className="flex-col text-center space-y-3">
      <h1 className="w-full font-bold text-2xl">Seu pedido é:</h1>
      {carrinho.length > 0 ? (
        <>
          {carrinho.map((item) => (
            <Product
              key={item.produto}
              title={item.produto}
              description={`Quantidade: ${item.quant}`}
              inCart
              />
          ))}
          
          <Link href="/agradecimento" className="px-5 py-3 w-full text-center justify-evenly bg-gray-700 rounded-2xl btn cursor-pointer transition-colors font-semibold flex">
            <span>Sim, está certo</span>
            <Check />
          </Link>
        </>
      ) : (
          <>
              <h2 className="w-full text-center text-xl">O carrinho está vazio!</h2>
              <Link href="/" className="underline">Quero encher o carrinho!</Link>
            </>
          )
        }
    </section>
  );
}
