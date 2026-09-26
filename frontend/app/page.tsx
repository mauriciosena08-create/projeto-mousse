"use client";

import { useEffect, useState, useCallback } from "react";
import Product from "@/components/Product";
import api from "@/lib/api";
import { useCarrinho } from "@/lib/atoms/carrinhoAtom";

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
    const carrinhoHook = useCarrinho() as any;

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
        const qtdSelecionada = 1;
        const nomeProduto = produto.produto || produto.nome || "Produto";
        const imagemUrl = produto.imagem || produto.image || produto.img || "";

        const itemCarrinho = {
            id: produto.id,
            produto: nomeProduto,
            quant: qtdSelecionada,
            quantidade: qtdSelecionada,
            imagem: imagemUrl,
            image: imagemUrl,
            img: imagemUrl,
        };

        // 1. Atualiza via Hook/Atom
        if (typeof carrinhoHook.adicionarProduto === "function") {
            carrinhoHook.adicionarProduto(itemCarrinho);
        } else if (typeof carrinhoHook.setCarrinho === "function") {
            carrinhoHook.setCarrinho((prev: any[]) => [...(prev || []), itemCarrinho]);
        }

        // 2. Salva no localStorage para garantir persistência
        try {
            const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho") || "[]");
            const indexExistente = carrinhoAtual.findIndex((i: any) => i.produto === nomeProduto);

            if (indexExistente >= 0) {
                carrinhoAtual[indexExistente].quant = (carrinhoAtual[indexExistente].quant || 1) + qtdSelecionada;
                carrinhoAtual[indexExistente].quantidade = carrinhoAtual[indexExistente].quant;
                carrinhoAtual[indexExistente].imagem = imagemUrl;
            } else {
                carrinhoAtual.push(itemCarrinho);
            }

            localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
        } catch (e) {
            console.error("Erro ao salvar carrinho no localStorage:", e);
        }

        // Exibe o aviso
        setMensagemSucesso(`${nomeProduto} adicionado ao carrinho!`);

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
