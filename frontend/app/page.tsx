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
    imagem?: string;
    image?: string;
    img?: string;
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
    const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

    const carregarProdutos = useCallback(async () => {
        try {
            setLoading(true);
            const API = api();
            const data: EstoqueResponse = await API.get_stock();

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

        const handleFocus = () => carregarProdutos();
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                carregarProdutos();
            }
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, [carregarProdutos]);

    const handleAddToCart = (produto: Produto) => {
        // Exibe o aviso
        setMensagemSucesso("Produto adicionado com sucesso!");

        // Remove a mensagem automaticamente após 3 segundos
        setTimeout(() => {
            setMensagemSucesso(null);
        }, 3000);
    };

    return (
        <section className="relative">
            <h1 className="text-white font-bold text-2xl my-5 text-center">
                Conheça nossos doces!
            </h1>

            {/* Pop-up / Toast de sucesso */}
            {mensagemSucesso && (
                <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg transition-all animate-bounce">
                    {mensagemSucesso}
                </div>
            )}

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
                        
                        const imagemUrl = item.imagem || item.image || item.img || "/placeholder.png";

                        return (
                            <Product
                                key={item.id}
                                title={titulo}
                                description={`Disponível: ${quantidade}`}
                                image={imagemUrl}
                                btnAdd={quantidade > 0}
                                onAdd={() => handleAddToCart(item)}
                            />
                        );
                    })}
                </section>
            )}
        </section>
    );
}
