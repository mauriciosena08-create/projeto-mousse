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

        // 1. Verifica se existe usuário logado no localStorage
        const usuarioSalvo = localStorage.getItem("usuario");
        if (!usuarioSalvo) {
            alert("Você precisa estar logado para fazer um pedido!");
            router.push("/login");
            return;
        }

        let usuario: any = null;
        try {
            usuario = JSON.parse(usuarioSalvo);
        } catch (e) {
            alert("Sessão inválida. Por favor, faça login novamente.");
            router.push("/login");
            return;
        }

        const nomeCliente = usuario?.nome || usuario?.cliente;
        if (!nomeCliente) {
            alert("Sessão inválida. Por favor, faça login novamente.");
            router.push("/login");
            return;
        }

        try {
            setEnviando(true);
            const API = api() as any;

            const itensFormatados = carrinho.map((item: any) => ({
                produto: item.produto,
                quantidade: item.quant || item.quantidade,
            }));

            // Método da API
            const criarPedido = API.create_order || API.add_order || API.pedir || API.post_order;
            
            if (typeof criarPedido === "function") {
                // Envia o cliente junto aos itens
                await criarPedido({ 
                    cliente: nomeCliente,
                    usuario_id: usuario.id,
                    itens: itensFormatados 
                });
            }

            // Limpa o armazenamento local do carrinho
            localStorage.removeItem("carrinho");
            localStorage.removeItem("cart");

            alert("Pedido confirmado com sucesso!");

            // Redireciona para o perfil para acompanhar o pedido
            window.location.href = "/perfil";
        } catch (error) {
            console.error("Erro ao confirmar pedido:", error);
            alert("Ocorreu um erro ao processar o seu pedido. Tente novamente.");
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
