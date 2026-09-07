"use client";

import { useEffect, useState } from "react";
import Product from "@/components/Product";
import api from "@/lib/api";

interface Produto {
    id: number;
    produto: string;
    quantidade_disponivel: number;
    data: string;
}

interface EstoqueResponse {
    sucesso: boolean;
    total_produtos: number;
    produtos: Produto[];
}

export default function Home() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarProdutos() {
            try {
                const API = api();

                const data: EstoqueResponse = await API.get_stock();

                console.log("Produtos:", data?.produtos);

                if (!data || !data.sucesso || !Array.isArray(data.produtos)) {
                    throw new Error("Erro ao obter produtos ou formato inválido.");
                }

                setProdutos(data.produtos);

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
            ) : !produtos || produtos.length === 0 ? (
                <p className="text-white text-center">
                    Nenhum produto disponível.
                </p>
            ) : (
                <section className="space-y-5 px-5 flex flex-wrap justify-around">
                    {produtos.map((item) => (
                        <Product
                            key={item.id}
                            title={item.produto}
                            description={`Disponível: ${item.quantidade_disponivel}`}
                            btnAdd={item.quantidade_disponivel > 0}
                        />
                    ))}
                </section>
            )}
        </section>
    );
}
