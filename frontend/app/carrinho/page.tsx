"use client";

import Product from "@/components/Product";
import { useCarrinho } from "@/lib/atoms/carrinhoAtom";
import Link from "next/link";

export default function Carrinho() {
    const { carrinho } = useCarrinho();

    return (
        <section>
            <h1 className="text-white font-bold text-2xl my-5 text-center">
                Meu carrinho
            </h1>

            <section className="space-y-5 px-5 flex flex-wrap justify-around">
                {carrinho.length > 0 ?
                (
                    <>
                    {
                        carrinho.map((item) => (

                        <Product
                            key={item.produto}
                            title={item.produto}
                            description={`Quantidade: ${item.quant}`}
                            inCart
                        />))
                    }
                    <Link href="/confirmacao" className="underline w-full text-center">Confirmar pedido</Link>
                    </>
                ) : (
                  <>
                    <h2 className="w-full text-center text-xl">O carrinho está vazio!</h2>
                    <Link href="/" className="underline">Quero encher o carrinho!</Link>
                  </>
                )}
                
            </section>
        </section>
    );
}