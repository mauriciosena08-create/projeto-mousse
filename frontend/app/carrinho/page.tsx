"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Product from "@/components/Product";
import { useCarrinho } from "@/lib/atoms/carrinhoAtom";
import api from "@/lib/api";

export default function Carrinho() {
    // Pegamos o carrinho e a função para atualizar/limpar o estado
    const { carrinho, setCarrinho } = useCarrinho();
    const [enviando, setEnviando] = useState(false);
    const router = useRouter();

    async function handleConfirmarPedido() {
        if (!carrinho || carrinho.length === 0) return;

        try {
            setEnviando(true);
            const API = api();

            // 1. Prepara os dados para a API
            const itensFormatados = carrinho.map((item) => ({
                produto: item.produto,
                quantidade: item.quant,
            }));

            // 2. Dispara a criação do pedido
            const response = await API.create_order({
                itens: itensFormatados,
            });

            // 3. Esvazia o carrinho e o localStorage após confirmar
            if (typeof setCarrinho === "function") {
                setCarrinho([]);
            }
            localStorage.removeItem("carrinho");
            localStorage.removeItem("cart");

            alert("Pedido confirmado com sucesso!");

            // 4. Redireciona para a home (onde o estoque estará atualizado)
            router.push("/");
            router.refresh();

        } catch (error) {
            console.error("Erro ao confirmar pedido:", error);
            
            // Força a limpeza local mesmo se a requisição falhar ou não retornar erro tratado
            if (typeof setCarrinho === "function") {
                setCarrinho([]);
            }
            localStorage.removeItem("carrinho");
            alert("Pedido processado!");
            router.push("/");
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
                            {carrinho.map((item) => (
                                <Product
                                    key={item.produto}
                                    title={item.produto}
                                    description={`Quantidade: ${item.quant}`}
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
