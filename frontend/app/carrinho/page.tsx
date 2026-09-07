"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Product from "@/components/Product";
import { useCarrinho } from "@/lib/atoms/carrinhoAtom";
import api from "@/lib/api";

export default function Carrinho() {
    const { carrinho, setCarrinho } = useCarrinho();
    const [enviando, setEnviando] = useState(false);
    const router = useRouter();

    async function confirmarPedido() {
        if (carrinho.length === 0) return;

        try {
            setEnviando(true);
            const API = api();

            // Formata os itens conforme o backend espera
            const itensFormatados = carrinho.map((item) => ({
                produto: item.produto,
                quantidade: item.quant,
            }));

            // Envia o pedido para a API
            const response = await API.create_order({
                itens: itensFormatados,
            });

            if (response && response.sucesso !== false) {
                alert("Pedido confirmado com sucesso!");

                // Esvazia o carrinho no estado local
                if (typeof setCarrinho === "function") {
                    setCarrinho([]);
                }
                
                // Garante que limpa do localStorage
                localStorage.removeItem("carrinho");

                // Redireciona para a página inicial ou de sucesso
                router.push("/");
            } else {
                alert(response?.mensagem || "Erro ao confirmar pedido.");
            }
        } catch (error) {
            console.error("Erro ao processar pedido:", error);
            alert("Ocorreu um erro ao enviar seu pedido. Tente novamente.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section>
            <h1 className="text-white font-bold text-2xl my-5 text-center">
                Meu carrinho
            </h1>

            <section className="space-y-5 px-5 flex flex-wrap justify-around">
                {carrinho && carrinho.length > 0 ? (
                    <>
                        {carrinho.map((item) => (
                            <Product
                                key={item.produto}
                                title={item.produto}
                                description={`Quantidade: ${item.quant}`}
                                inCart
                            />
                        ))}

                        <button
                            onClick={confirmarPedido}
                            disabled={enviando}
                            className="underline w-full text-center text-white cursor-pointer disabled:opacity-50 mt-4"
                        >
                            {enviando ? "Confirmando pedido..." : "Confirmar pedido"}
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3">
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
