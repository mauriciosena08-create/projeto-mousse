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
    const [mensagemErro, setMensagemErro] = useState<string | null>(null);
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

    const handleAddToCart = (produto: Produto, quantidadeParaAdicionar: number = 1) => {
        const qtdDesejada = Number(quantidadeParaAdicionar) || 1;
        const nomeProduto = produto.produto || produto.nome || "Produto";
        const imagemUrl = produto.imagem || produto.image || produto.img || "";

        // Obtém a quantidade total em estoque disponível no servidor
        const estoqueMaximo = Math.max(
            0,
            produto.quantidade_disponivel ??
            produto.quantidade ??
            produto.quant ??
            0
        );

        let carrinhoAtual: any[] = [];
        try {
            carrinhoAtual = JSON.parse(localStorage.getItem("carrinho") || "[]");
        } catch (e) {
            carrinhoAtual = [];
        }

        const indexExistente = carrinhoAtual.findIndex(
            (i: any) => i.id === produto.id || i.produto === nomeProduto
        );

        // Quantidade total que já está no carrinho
        const qtdJaNoCarrinho = indexExistente >= 0
            ? Number(carrinhoAtual[indexExistente].quant || carrinhoAtual[indexExistente].quantidade || 0)
            : 0;

        const novaQuantidadeTotal = qtdJaNoCarrinho + qtdDesejada;

        // TRAVA DE ESTOQUE: Se a soma ultrapassar o limite disponível, exibe o aviso de erro e cancela
        if (novaQuantidadeTotal > estoqueMaximo) {
            setMensagemSucesso(null);
            setMensagemErro(
                `Limite em estoque atingido! (${estoqueMaximo} disponíve${estoqueMaximo === 1 ? 'l' : 'is'})`
            );
            setTimeout(() => {
                setMensagemErro(null);
            }, 3000);
            return;
        }

        const itemCarrinho = {
            id: produto.id,
            produto: nomeProduto,
            quant: novaQuantidadeTotal,
            quantidade: novaQuantidadeTotal,
            imagem: imagemUrl,
            image: imagemUrl,
            img: imagemUrl,
        };

        // Salva no localStorage
        if (indexExistente >= 0) {
            carrinhoAtual[indexExistente] = itemCarrinho;
        } else {
            carrinhoAtual.push(itemCarrinho);
        }

        try {
            localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
        } catch (e) {
            console.error("Erro ao salvar carrinho no localStorage:", e);
        }

        // Atualiza o estado/atom do carrinho
        if (typeof carrinhoHook.adicionarProduto === "function") {
            carrinhoHook.adicionarProduto(itemCarrinho);
        } else if (typeof carrinhoHook.setCarrinho === "function") {
            carrinhoHook.setCarrinho(carrinhoAtual);
        }

        // Mensagem de sucesso
        setMensagemErro(null);
        setMensagemSucesso(`${qtdDesejada}x ${nomeProduto} adicionado(s) ao carrinho!`);

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

            {/* Pop-up / Toast de erro (Limite de estoque) */}
            {mensagemErro && (
                <div className="fixed top-5 right-5 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg transition-all animate-bounce font-bold">
                    {mensagemErro}
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
                                onAdd={(qtdSelecionada?: number) =>
                                    handleAddToCart(item, qtdSelecionada || 1)
                                }
                            />
                        );
                    })}
                </section>
            )}
        </section>
    );
}
