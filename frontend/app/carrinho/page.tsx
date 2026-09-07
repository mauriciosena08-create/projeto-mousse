"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Product from "@/components/Product";
import { useCarrinho } from "@/lib/atoms/carrinhoAtom";
import api from "@/lib/api";

export default function Carrinho() {
    const carrinhoHook = useCarrinho() as any;
    const carrinho = carrinhoHook.carrinho || [];
    const [enviando, setEnviando] = useState(false);
    const router = useRouter();

    async function handleConfirmarPedido() {
        if (!carrinho || carrinho.length === 0) return;

        try {
            setEnviando(true);
            const API = api() as any;

            const itensFormatados = carrinho.map((item: any) => ({
                produto: item.produto,
                quantidade: item.quant || item.quantidade,
            }));

            // Chama o método da API (com fallback caso o nome no api.ts seja diferente)
            const criarPedido = API.create_order || API.add_order || API.pedir || API.post_order;
            
            if (typeof criarPedido === "function") {
                await criarPedido({ itens: itensFormatados });
            }

            // Limpa o armazenamento local do carrinho
            localStorage.removeItem("carrinho");
            localStorage.removeItem("cart");

            alert("Pedido confirmado com sucesso!");

            // Força a recarga para atualizar a tela e o estado
            window.location.href = "/";
        } catch (error) {
            console.error("Erro ao confirmar pedido:", error);
            localStorage.removeItem("carrinho");
            window.location.href = "/";
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section>
            <h1 className="text-white font-bold text-2xl my-5 text-center">
                Meu carrinho
            </h1>

            <section className="space-y-5 px-5 flex flex-col items-center">
                {carrinho && carrinho.length > 0 ? (
                    <>
                        <div className="flex flex-wrap justify-around w-full gap-4">
                            {carrinho.map((item: any) => (
                                <Product
                                    key={item.produto}
                                    title={item.produto}
                                    description={`Quantidade: ${item.quant || item.quantidade}`}
                                    inCart
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleConfirmarPedido}
                            disabled={enviando}
                            className="underline w-full text-center text-white cursor-pointer text-lg font-medium mt-6 disabled:opacity-50"
                        >
                            {enviando ? "Confirmando pedido..." : "Confirmar pedido"}
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 my-10">
                        <h2 className="w-full text-center text-xl text-white">
                            O carrinho está vazio!
                        </h2>
                        <Link href="/" className="underline text-white">
                            Quero encher o carrinho!
                        </Link>
                    </div>
                )}
            </section>
        </section>
    );
}
