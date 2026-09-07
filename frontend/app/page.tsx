"use client";

import { useEffect, useState } from "react";
import Product from "@/components/Product";
import api from "@/lib/api";

interface Produto {
    id: number;
    produto?: string;
    nome?: string;
    quantidade_disponivel?: number;
    quantidade?: number;
    quant?: number;
    data?: string;
}

interface EstoqueResponse {
    sucesso?: boolean;
    total_produtos?: number;
    produtos?: Produto[];
    estoque?: Produto[];
}

export default function Home() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarProdutos() {
            try {
                const API = api();

                const data: EstoqueResponse = await API.get_stock();

                console.log("Resposta API:", data);

                // Busca o array dentro de data.estoque, data.produtos ou no próprio data
                if (data && Array.isArray(data.estoque)) {
                    setProdutos(data.estoque);
                } else if (data && Array.isArray(data.produtos)) {
                    setProdutos(data.produtos);
                } else if (Array.isArray(data)) {
                    setProdutos(data);
                } else {
                    setProdutos([]);
                }

            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
                setProdutos([]);
            } finally {
                setLoading(false);
            }
        }

        carregarProdutos();
    }, []);

    return (
        <section>
            <h1 className="text-white font-bold text-2xl my-5 ml-5 text-center">
                Conheça nossos doces!
            </h1>

            {loading ? (
                <p className="text-white text-center">
                    Carregando produtos...
                </p>
            ) : !Array.isArray(produtos) || produtos.length === 0 ? (
                <p className="text-white text-center">
                    Nenhum produto disponível.
                </p>
            ) : (
                <section className="space-y-5 px-5 flex flex-wrap justify-around">
                    {produtos.map((item) => {
                        // Tenta capturar o nome/titulo
                        const titulo = item.produto || item.nome || "Produto";

                        // Tenta capturar a quantidade disponível
                        const quantidade =
                            item.quantidade_disponivel ??
                            item.quantidade ??
                            item.quant ??
                            0;

                        return (
                            <Product
                                key={item.id}
                                title={titulo}
                                description={`Disponível: ${quantidade}`}
                                btnAdd={quantidade > 0}
                            />
                        );
                    })}
                </section>
            )}
        </section>
    );
}
