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

export default function PedidoDetalhe({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        async function carregarPedido() {
            try {
                const API = api();
                const response = await API.get_orders();

                const listaPedidos: Pedido[] = Array.isArray(response) 
                    ? response 
                    : response?.pedidos || [];

                const encontrado = listaPedidos.find(
                    (p) => String(p.id) === String(id)
                );

                if (encontrado) {
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

    // Função para finalizar o pedido
    const handleFinalizarPedido = async () => {
        if (!pedido) return;
        
        setUpdating(true);
        try {
            const API = api();
            await API.update_order_status(pedido.id, "Concluído");
            
            // Atualiza o estado local para mudar na tela sem precisar recarregar
            setPedido((prev) => prev ? { ...prev, status: "Concluído" } : null);
            alert("Pedido finalizado com sucesso!");
        } catch (error) {
            alert("Erro ao finalizar o pedido. Tente novamente.");
        } finally {
            setUpdating(false);
        }
    };

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
                        onClick={handleFinalizarPedido}
                        disabled={updating}
                        className={`${figmaStyles.button} ${figmaStyles.purpleButton} ${figmaStyles.detailButton}`}
                    >
                        {updating ? "Finalizando..." : "Finalizar pedido"}
                    </button>
                )}
            </FigmaCard>
        </div>
    );
}
