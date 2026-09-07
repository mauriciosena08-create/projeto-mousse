"use client";

import { useEffect, useState, useCallback } from "react";
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

    const carregarProdutos = useCallback(async () => {
        try {
            setLoading(true);
            const API = api();
            const data: EstoqueResponse = await API.get_stock();

            // Extrai a lista do campo correto vindo do PHP (estoque, produtos ou array direto)
            let lista: Produto[] = [];

            if (data && Array.isArray(data.estoque)) {
                lista = data.estoque;
            } else if (data && Array.isArray(data.produtos)) {
                lista = data.produtos;
            } else if (Array.isArray(data)) {
                lista = data;
            }

            setProdutos(lista);
        } catch (err) {
            console.error("Erro ao carregar produtos:", err);
            setProdutos([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        carregarProdutos();

        // Atualiza os produtos quando a janela ganha foco novamente
        const handleFocus = () => carregarProdutos();
        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, [carregarProdutos]);

    return (
        <section>
            <h1 className="text-white font-bold text-2xl my-5 text-center">
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
                        const titulo = item.produto || item.nome || "Produto";
                        const quantidade = Math.max(
                            0,
                            item.quantidade_disponivel ??
                            item.quantidade ??
                            item.quant ??
                            0
                        );

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
