"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaCard, figmaStyles } from "@/components/FigmaPage";
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

interface PedidosResponse {
    sucesso: boolean;
    total_pedidos: number;
    pedidos: Pedido[];
}

export default function PedidoDetalhe({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarPedido() {
            try {
                const { id } = await params;

                const API = api();

                const data: PedidosResponse = await API.get_orders();

                if (!data.sucesso) {
                    throw new Error("Erro ao carregar pedidos.");
                }

                const encontrado = data.pedidos.find(
                    (pedido) => pedido.id === Number(id)
                );

                if (!encontrado) {
                    throw new Error("Pedido não encontrado.");
                }

                setPedido(encontrado);

            } catch (err) {
                console.error("Erro ao carregar pedido:", err);
            } finally {
                setLoading(false);
            }
        }

        carregarPedido();
    }, [params]);

    if (loading) {
        return (
            <div className={`${figmaStyles.adminContent} h-full mx-auto`}>
                <p className="text-center">
                    Carregando pedido...
                </p>
            </div>
        );
    }

    if (!pedido) {
        return (
            <div className={`${figmaStyles.adminContent} h-full mx-auto`}>
                <p className="text-center">
                    Pedido não encontrado.
                </p>
            </div>
        );
    }

    return (
        <>
            <div
                className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto`}
            >
                <div className={figmaStyles.profileHead}>
                    <FigmaUserIcon />
                    <span>Admin.</span>
                </div>

                <FigmaCard>
                    <div className={figmaStyles.ordersHeading}>
                        <Link href="/admin/pedidos">
                            <ArrowLeft size={20} />
                        </Link>

                        <span>
                            Pedido #{pedido.id}
                        </span>
                    </div>

                    <div className={figmaStyles.detail}>
                        <p>
                            Nome: {pedido.nome}
                        </p>

                        <p>
                            Curso: {pedido.curso}
                        </p>

                        <p>
                            Período: {pedido.periodo}
                        </p>

                        <p className={figmaStyles.detailGap}>
                            • &nbsp;Pedido:
                        </p>

                        {pedido.itens.map((item) => (
                            <p key={item.produto_id}>
                                {item.quantidade}x {item.produto}
                            </p>
                        ))}

                        <p className={figmaStyles.detailGap}>
                            Data do pedido: {pedido.data}
                        </p>

                        <p>
                            Status: {pedido.status}
                        </p>
                    </div>

                    {pedido.status === "Pendente" && (
                        <button
                            className={`${figmaStyles.button} ${figmaStyles.purpleButton} ${figmaStyles.detailButton}`}
                        >
                            Finalizar pedido
                        </button>
                    )}
                </FigmaCard>
            </div>
        </>
    );
}