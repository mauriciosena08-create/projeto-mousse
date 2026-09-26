"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { figmaStyles } from "@/components/FigmaPage";
import api from "@/lib/api";

interface Pedido {
    id: number;
    usuario_id: number;
    itens: {
        produto_id: number;
        produto: string;
        quantidade: number;
    }[];
    status: string;
    data: string;
    nome: string;
    curso: string;
    periodo: string;
}

export default function PedidosAdmin() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarPedidos() {
            try {
                const API = api();

                const data = await API.get_orders();

                if (data && Array.isArray(data.pedidos)) {
                    setPedidos(data.pedidos);
                } else if (Array.isArray(data)) {
                    setPedidos(data);
                } else {
                    setPedidos([]);
                }

            } catch (err) {
                console.error("Erro ao carregar pedidos:", err);
                setPedidos([]);
            } finally {
                setLoading(false);
            }
        }

        carregarPedidos();
    }, []);

    // Filtra apenas os pedidos que ainda NÃO foram concluídos/entregues
    const pedidosPendentesList = Array.isArray(pedidos)
        ? pedidos.filter(
            (pedido) =>
                pedido.status !== "Concluído" &&
                pedido.status !== "Concluido" &&
                pedido.status !== "Entregue" &&
                pedido.status !== "concluido"
        )
        : [];

    const pendentesCount = pedidosPendentesList.length;

    return (
        <>
            <div
                className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto`}
            >
                <div className={figmaStyles.profileHead}>
                    <FigmaUserIcon />
                    <span>Admin.</span>
                </div>

                <section className={figmaStyles.ordersBox}>
                    <div className={figmaStyles.ordersHeading}>
                        <Link href="/admin">
                            <ArrowLeft size={20} />
                        </Link>

                        <span>
                            Pedidos ({pendentesCount} pendentes)
                        </span>
                    </div>

                    <div className={figmaStyles.ordersList}>

                        {loading ? (
                            <p className="text-center">
                                Carregando pedidos...
                            </p>
                        ) : pedidosPendentesList.length === 0 ? (
                            <p className="text-center">
                                Nenhum pedido pendente encontrado.
                            </p>
                        ) : (
                            pedidosPendentesList.map((pedido) => (
                                <Link
                                    href={`/admin/pedidos/${pedido.id}`}
                                    className={figmaStyles.adminOrder}
                                    key={pedido.id}
                                >
                                    <strong>
                                        Pedido #{pedido.id}
                                    </strong>

                                    <strong>
                                        Nome: {pedido.nome}
                                    </strong>

                                    <span>
                                        Clique para ver mais...
                                    </span>
                                </Link>
                            ))
                        )}

                    </div>
                </section>
            </div>
        </>
    );
}
