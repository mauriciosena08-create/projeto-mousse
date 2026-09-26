"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle } from "lucide-react";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { figmaStyles } from "@/components/FigmaPage";
import api from "@/lib/api";

export default function DetalhesPedidoAdmin({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const pedidoId = resolvedParams.id;
    const router = useRouter();

    const [pedido, setPedido] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [atualizando, setAtualizando] = useState(false);

    useEffect(() => {
        async function carregarPedido() {
            try {
                setLoading(true);
                const API = api();
                const data = await API.get_orders();

                let listaPedidos: any[] = [];
                if (data && Array.isArray(data.pedidos)) {
                    listaPedidos = data.pedidos;
                } else if (data && Array.isArray(data.orders)) {
                    listaPedidos = data.orders;
                } else if (Array.isArray(data)) {
                    listaPedidos = data;
                }

                // Comparação flexível (String vs Number)
                const encontrado = listaPedidos.find(
                    (p) => String(p.id) === String(pedidoId) || String(p.pedido_id) === String(pedidoId)
                );

                setPedido(encontrado || null);
            } catch (err) {
                console.error("Erro ao carregar detalhes do pedido:", err);
                setPedido(null);
            } finally {
                setLoading(false);
            }
        }

        if (pedidoId) {
            carregarPedido();
        }
    }, [pedidoId]);

    const handleConcluirPedido = async () => {
        try {
            setAtualizando(true);
            const API = api() as any;

            if (typeof API.update_order_status === "function") {
                await API.update_order_status(pedidoId, "Concluído");
            } else {
                const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://projeto-mousse.onrender.com";
                await fetch(`${backendUrl}/update_order_status.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: pedidoId, status: "Concluído" }),
                });
            }

            router.push("/admin");
        } catch (err) {
            console.error("Erro ao concluir pedido:", err);
            alert("Erro ao atualizar o status do pedido.");
        } finally {
            setAtualizando(false);
        }
    };

    // 1. Extração do nome do cliente em todas as chaves possíveis do DB
    const nomeCliente = pedido
        ? pedido.nome ||
          pedido.cliente ||
          pedido.nome_cliente ||
          pedido.usuario_nome ||
          pedido.usuario ||
          pedido.comprador ||
          (pedido.user && pedido.user.nome) ||
          "Não informado"
        : "Não informado";

    // 2. Extração dos itens do pedido (seja Array, JSON String ou campo "produto")
    let listaItens: any[] = [];
    if (pedido) {
        if (Array.isArray(pedido.itens) && pedido.itens.length > 0) {
            listaItens = pedido.itens;
        } else if (Array.isArray(pedido.produtos) && pedido.produtos.length > 0) {
            listaItens = pedido.produtos;
        } else if (typeof pedido.itens === "string") {
            try {
                listaItens = JSON.parse(pedido.itens);
            } catch (e) {
                listaItens = [{ produto: pedido.itens, quantidade: 1 }];
            }
        } else if (pedido.produto) {
            listaItens = [
                {
                    produto: pedido.produto,
                    quantidade: pedido.quantidade || pedido.quant || 1,
                },
            ];
        }
    }

    return (
        <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto p-5 text-white max-w-md`}>
            {/* Cabeçalho de Perfil */}
            <div className="flex items-center gap-3 justify-center mb-6">
                <FigmaUserIcon />
                <span className="text-xl font-bold text-white">Admin.</span>
            </div>

            {/* Cartão de Detalhes com tema Chocolate & Rosa Doce */}
            <section className="bg-[#2a1714]/80 backdrop-blur-sm border border-[#f4a8b8]/30 rounded-2xl p-6 shadow-xl text-white">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#f4a8b8]/20">
                    <Link href="/admin" className="text-[#f4a8b8] hover:text-white transition">
                        <ArrowLeft size={22} />
                    </Link>
                    <h2 className="text-xl font-bold text-white">
                        Pedido #{pedidoId}
                    </h2>
                </div>

                {loading ? (
                    <p className="text-center text-white/70 py-4">Carregando detalhes...</p>
                ) : !pedido ? (
                    <p className="text-center text-white/70 py-4">Pedido #{pedidoId} não encontrado.</p>
                ) : (
                    <div className="space-y-4">
                        {/* Cliente */}
                        <div>
                            <span className="text-xs text-[#f4a8b8] block uppercase tracking-wider font-semibold">CLIENTE</span>
                            <p className="text-base font-bold text-white">{nomeCliente}</p>
                        </div>

                        {/* Curso / Período */}
                        {(pedido.curso || pedido.periodo) && (
                            <div>
                                <span className="text-xs text-[#f4a8b8] block uppercase tracking-wider font-semibold">CURSO / PERÍODO</span>
                                <p className="text-sm text-white/90">
                                    {pedido.curso || ""} {pedido.periodo ? `- ${pedido.periodo}` : ""}
                                </p>
                            </div>
                        )}

                        {/* Itens do Pedido */}
                        <div>
                            <span className="text-xs text-[#f4a8b8] block uppercase tracking-wider font-semibold mb-1">ITENS DO PEDIDO</span>
                            {listaItens && listaItens.length > 0 ? (
                                <ul className="space-y-1 bg-[#3d231d]/60 p-3 rounded-xl border border-[#f4a8b8]/10">
                                    {listaItens.map((item: any, index: number) => (
                                        <li key={index} className="text-sm text-white flex justify-between items-center">
                                            <span>• {item.produto || item.nome || item.nome_produto || "Produto"}</span>
                                            <span className="font-bold text-[#f4a8b8]">
                                                {item.quantidade || item.quant || 1}x
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-white/70">Nenhum item especificado.</p>
                            )}
                        </div>

                        {/* Data e Status */}
                        <div className="pt-2 border-t border-[#f4a8b8]/20 flex justify-between items-center text-xs text-white/80">
                            <span>Data: {pedido.data || pedido.created_at || "N/A"}</span>
                            <span className="bg-[#f4a8b8] text-[#3d231d] font-bold px-2.5 py-1 rounded-full text-xs">
                                {pedido.status || "Pendente"}
                            </span>
                        </div>

                        {/* Botão de Concluir Pedido */}
                        <button
                            onClick={handleConcluirPedido}
                            disabled={atualizando || pedido.status === "Concluído"}
                            className="w-full mt-4 py-3 px-4 rounded-xl bg-[#f4a8b8] hover:bg-[#e892a2] text-[#3d231d] font-bold transition text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                        >
                            <CheckCircle size={18} />
                            {atualizando ? "A concluir..." : "Concluir Pedido"}
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
