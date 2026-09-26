"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { figmaStyles } from "@/components/FigmaPage";
import api from "@/lib/api";

interface ItemPedido {
    produto_id: number;
    produto: string;
    quantidade: number;
}

interface Pedido {
    id: number;
    usuario_id: number;
    itens: ItemPedido[];
    status: string;
    data: string;
    nome: string;
    curso: string;
    periodo: string;
}

export default function DetalhesPedidoAdmin({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const pedidoId = resolvedParams.id;

    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarPedido() {
            try {
                const API = api();
                const data = await API.get_orders();

                let listaPedidos: Pedido[] = [];
                if (data && Array.isArray(data.pedidos)) {
                    listaPedidos = data.pedidos;
                } else if (Array.isArray(data)) {
                    listaPedidos = data;
                }

                const encontrado = listaPedidos.find((p) => String(p.id) === String(pedidoId));
                setPedido(encontrado || null);
            } catch (err) {
                console.error("Erro ao carregar detalhes do pedido:", err);
                setPedido(null);
            } finally {
                setLoading(false);
            }
        }

        carregarPedido();
    }, [pedidoId]);

    return (
        <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto p-5 text-white max-w-md`}>
            {/* Cabeçalho de Perfil */}
            <div className="flex items-center gap-3 justify-center mb-6">
                <FigmaUserIcon />
                <span className="text-xl font-bold text-white">Admin.</span>
            </div>

            {/* Card com os detalhes do pedido */}
            <section className="bg-[#2a1714]/80 backdrop-blur-sm border border-[#f4a8b8]/30 rounded-2xl p-6 shadow-xl text-white">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#f4a8b8]/20">
                    <Link href="/admin/pedidos" className="text-[#f4a8b8] hover:text-white transition">
                        <ArrowLeft size={22} />
                    </Link>
                    <h2 className="text-xl font-bold text-white">
                        Pedido #{pedidoId}
                    </h2>
                </div>

                {loading ? (
                    <p className="text-center text-white/70 py-4">Carregando detalhes...</p>
                ) : !pedido ? (
                    <p className="text-center text-white/70 py-4">Pedido não encontrado.</p>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs text-[#f4a8b8] block uppercase tracking-wider font-semibold">Cliente</span>
                            <p className="text-base font-bold text-white">{pedido.nome || "Não informado"}</p>
                        </div>

                        {pedido.curso && (
                            <div>
                                <span className="text-xs text-[#f4a8b8] block uppercase tracking-wider font-semibold">Curso / Período</span>
                                <p className="text-sm text-white/90">{pedido.curso} {pedido.periodo ? `- ${pedido.periodo}` : ""}</p>
                            </div>
                        )}

                        <div>
                            <span className="text-xs text-[#f4a8b8] block uppercase tracking-wider font-semibold mb-1">Itens do Pedido</span>
                            {Array.isArray(pedido.itens) && pedido.itens.length > 0 ? (
                                <ul className="space-y-1 bg-[#3d231d]/60 p-3 rounded-xl border border-[#f4a8b8]/10">
                                    {pedido.itens.map((item, index) => (
                                        <li key={index} className="text-sm text-white flex justify-between">
                                            <span>• {item.produto}</span>
                                            <span className="font-bold text-[#f4a8b8]">{item.quantidade}x</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-white/70">Nenhum item especificado.</p>
                            )}
                        </div>

                        <div className="pt-2 border-t border-[#f4a8b8]/20 flex justify-between items-center text-xs text-white/80">
                            <span>Data: {pedido.data}</span>
                            <span className="bg-[#f4a8b8] text-[#3d231d] font-bold px-2.5 py-1 rounded-full text-xs">
                                {pedido.status}
                            </span>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
