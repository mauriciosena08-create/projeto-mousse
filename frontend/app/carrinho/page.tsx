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

        const nomeCliente = usuario?.nome || usuario?.cliente || usuario?.usuario;
        if (!nomeCliente) {
            alert("Sessão inválida. Por favor, faça login novamente.");
            router.push("/login");
            return;
        }

        try {
            setEnviando(true);

            // Concatena os nomes dos produtos para formatos que esperam uma string simples
            const resumoProdutos = carrinho
                .map((i: any) => `${i.quant || i.quantidade || 1}x ${i.produto}`)
                .join(", ");

            const itensFormatados = carrinho.map((item: any) => ({
                produto_id: item.id,
                produto: item.produto,
                quantidade: item.quant || item.quantidade || 1,
                quant: item.quant || item.quantidade || 1,
            }));

            // Payload híbrido completo (garante compatibilidade com tabelas relacionais ou simples)
            const payloadPedido = {
                // Informações do Cliente
                nome: nomeCliente,
                cliente: nomeCliente,
                usuario_nome: nomeCliente,
                comprador: nomeCliente,
                usuario_id: usuario.id,
                curso: usuario.curso || "",
                periodo: usuario.periodo || "",

                // Estrutura de Lista de Itens
                itens: itensFormatados,
                produtos: itensFormatados,

                // Estrutura de Texto Plano (Fallback para PHP/DB legados)
                produto: resumoProdutos,
                quantidade: carrinho.reduce(
                    (total: number, item: any) => total + (item.quant || item.quantidade || 1),
                    0
                ),

                data: new Date().toISOString(),
                status: "Pendente",
            };

            const backendUrl =
                process.env.NEXT_PUBLIC_API_URL || "https://projeto-mousse.onrender.com";

            // Envio direto via fetch para garantir que todos os campos do JSON são transmitidos
            const response = await fetch(`${backendUrl}/create_order.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadPedido),
            });

            if (!response.ok) {
                throw new Error("Erro na comunicação com o servidor.");
            }

            // Limpa o armazenamento local do carrinho e o estado do atom
            localStorage.removeItem("carrinho");
            localStorage.removeItem("cart");
            if (typeof carrinhoHook.setCarrinho === "function") {
                carrinhoHook.setCarrinho([]);
            }

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
                                    {...({
                                        imageUrl: item.imagem || item.image || item.img,
                                        imagem: item.imagem || item.image || item.img,
                                        image: item.imagem || item.image || item.img,
                                        img: item.imagem || item.image || item.img,
                                    } as any)}
                                    description={`Quantidade: ${item.quant || item.quantidade}`}
                                    inCart
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleConfirmarPedido}
                            disabled={enviando}
                            className="w-full max-w-xs py-3 px-4 rounded-xl bg-[#f4a8b8] hover:bg-[#e892a2] text-[#3d231d] font-bold transition text-center text-lg mt-6 shadow-md disabled:opacity-50 cursor-pointer"
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
