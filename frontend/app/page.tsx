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

    const handleAddToCart = (produto: Produto, quantidadeAdicionar: number = 1) => {
        const qtdAAdicionar = Number(quantidadeAdicionar) > 0 ? Number(quantidadeAdicionar) : 1;
        const nomeProduto = produto.produto || produto.nome || "Produto";
        const imagemUrl = produto.imagem || produto.image || produto.img || "";

        // Obtém o estoque limite disponível do produto
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

        // Quantidade que o usuário já possui no carrinho
        const qtdJaNoCarrinho = indexExistente >= 0
            ? Number(carrinhoAtual[indexExistente].quant || carrinhoAtual[indexExistente].quantidade || 0)
            : 0;

        // Total que ficaria no carrinho se adicionarmos a quantidade desejada
        const totalProposto = qtdJaNoCarrinho + qtdAAdicionar;

        // TRAVA DE ESTOQUE: Se ultrapassar o total em estoque, exibe erro e aborta
        if (totalProposto > estoqueMaximo) {
            setMensagemSucesso(null);
            setMensagemErro(
                `Limite em estoque atingido! (${estoqueMaximo} disponíve${estoqueMaximo === 1 ? 'l' : 'is'})`
            );
            setTimeout(() => setMensagemErro(null), 3000);
            return;
        }

        const itemCarrinho = {
            id: produto.id,
            produto: nomeProduto,
            quant: totalProposto,
            quantidade: totalProposto,
            imagem: imagemUrl,
            image: imagemUrl,
            img: imagemUrl,
        };

        // Atualiza no localStorage
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

        // Atualiza Estado/Atom
        if (typeof carrinhoHook.setCarrinho === "function") {
            carrinhoHook.setCarrinho(carrinhoAtual);
        } else if (typeof carrinhoHook.adicionarProduto === "function") {
            carrinhoHook.adicionarProduto(itemCarrinho);
        }

        // Mensagem de sucesso
        setMensagemErro(null);
        setMensagemSucesso(`${qtdAAdicionar}x ${nomeProduto} adicionado(s) ao carrinho!`);
        setTimeout(() => setMensagemSucesso(null), 3000);
    };

    return (
        <section className="relative">
            <h1 className="text-white font-bold text-2xl my-5 text-center">
                Conheça nossos doces!
            </h1>

            {/* Toast de sucesso */}
            {mensagemSucesso && (
                <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg transition-all animate-bounce font-bold">
                    {mensagemSucesso}
                </div>
            )}

            {/* Toast de erro */}
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
                                onAdd={(qtdDoCard?: number) =>
                                    handleAddToCart(item, qtdDoCard || 1)
                                }
                            />
                        );
                    })}
                </section>
            )}
        </section>
    );
}
