"use client";

import Link from "next/link";
import { useEffect, useState, use } from "react";
import { ArrowLeft } from "lucide-react";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaCard, figmaStyles } from "@/components/FigmaPage";
import api from "@/lib/api";

interface ItemPedido {
    produto_id?: number;
    produto?: string;
    nome?: string;
    quantidade?: number;
    quant?: number;
}

interface Pedido {
    id: number;
    usuario_id?: number;
    cliente?: string;
    nome?: string;
    itens: ItemPedido[] | string;
    status?: string;
    data?: string;
    curso?: string;
    periodo?: string;
}

interface PedidosResponse {
    sucesso: boolean;
    total_pedidos?: number;
    pedidos?: Pedido[];
}

export default function PedidoDetalhe({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Resolve o params com 'use' nativo do React para Next.js 15+
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarPedido() {
            try {
                const API = api();
                const response = await API.get_orders();

                // Lida com caso a resposta venha como array direto ou objeto com key 'pedidos'
                const listaPedidos: Pedido[] = Array.isArray(response) 
                    ? response 
                    : response?.pedidos || [];

                const encontrado = listaPedidos.find(
                    (p) => String(p.id) === String(id)
                );

                if (encontrado) {
                    // Trata a conversão segura do JSON de itens
                    if (typeof encontrado.itens === "string") {
                        try {
                            encontrado.itens = JSON.parse(encontrado.itens);
                        } catch (e) {
                            encontrado.itens = [];
                        }
                    }
                    setPedido(encontrado);
                }
            } catch (err) {
                console.error("Erro ao carregar pedido:", err);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            carregarPedido();
        }
    }, [id]);

    if (loading) {
        return (
            <div className={`${figmaStyles.adminContent} h-full mx-auto`}>
                <p className="text-center">Carregando pedido...</p>
            </div>
        );
    }

    if (!pedido) {
        return (
            <div className={`${figmaStyles.adminContent} h-full mx-auto`}>
                <p className="text-center">Pedido #{id} não encontrado.</p>
            </div>
        );
    }

    // Garante que itens seja sempre um array iterável
    const listaItens: ItemPedido[] = Array.isArray(pedido.itens) ? pedido.itens : [];

    return (
        <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto`}>
            <div className={figmaStyles.profileHead}>
                <FigmaUserIcon />
                <span>Admin.</span>
            </div>

            <FigmaCard>
                <div className={figmaStyles.ordersHeading}>
                    <Link href="/admin/pedidos">
                        <ArrowLeft size={20} />
                    </Link>

                    <span>Pedido #{pedido.id}</span>
                </div>

                <div className={figmaStyles.detail}>
                    <p>Nome: {pedido.nome || pedido.cliente || "Não informado"}</p>
                    
                    {pedido.curso && <p>Curso: {pedido.curso}</p>}
                    {pedido.periodo && <p>Período: {pedido.periodo}</p>}

                    <p className={figmaStyles.detailGap}>
                        • &nbsp;Itens do Pedido:
                    </p>

                    {listaItens.length > 0 ? (
                        listaItens.map((item, index) => (
                            <p key={index}>
                                {item.quantidade || item.quant || 1}x {item.produto || item.nome || "Produto sem nome"}
                            </p>
                        ))
                    ) : (
                        <p>Nenhum item listado.</p>
                    )}

                    <p className={figmaStyles.detailGap}>
                        Data do pedido: {pedido.data || "Sem data"}
                    </p>

                    <p>Status: {pedido.status || "Pendente"}</p>
                </div>

                {(pedido.status === "Pendente" || !pedido.status) && (
                    <button
                        className={`${figmaStyles.button} ${figmaStyles.purpleButton} ${figmaStyles.detailButton}`}
                    >
                        Finalizar pedido
                    </button>
                )}
            </FigmaCard>
        </div>
    );
}
