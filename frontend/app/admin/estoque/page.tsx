"use client";

import { useEffect, useState } from "react";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { figmaStyles } from "@/components/FigmaPage";
import api from "@/lib/api";

type EstoqueItem = {
    id: number;
    produto: string;
    quantidade_disponivel: number;
    data: string;
};

export default function Estoque() {
    const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
    const [novoProduto, setNovoProduto] = useState("");
    const [novaQuantidade, setNovaQuantidade] = useState("");
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        async function carregarEstoque() {
            try {
                const API = api();

                const data = await API.get_stock();

                if (!data.sucesso) {
                    throw new Error(data.mensagem);
                }

                setEstoque(data.produtos);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        carregarEstoque();
    }, []);

    function alterarQuantidade(
        id: number,
        quantidade: string
    ) {
        const valor = Math.max(0, Number(quantidade));

        setEstoque(atual =>
            atual.map(item =>
                item.id === id
                    ? {
                        ...item,
                        quantidade_disponivel: valor,
                    }
                    : item
            )
        );
    }

    async function adicionarProduto() {
        if (!novoProduto.trim()) {
            alert("Digite o nome do produto.");
            return;
        }

        const quantidade = Number(novaQuantidade);

        if (quantidade < 0 || !Number.isInteger(quantidade)) {
            alert("Digite uma quantidade válida.");
            return;
        }

        try {
            setSalvando(true);

            const API = api();

            await API.add_stock(
                novoProduto.trim(),
                quantidade
            );

            const data = await API.get_stock();

            if (!data.sucesso) {
                throw new Error(data.mensagem);
            }

            setEstoque(data.produtos);

            setNovoProduto("");
            setNovaQuantidade("");

        } catch (err) {
            console.error(err);
            alert("Erro ao adicionar produto.");

        } finally {
            setSalvando(false);
        }
    }

    async function salvarAlteracoes() {
        try {
            setSalvando(true);

            const API = api();

            await Promise.all(
                estoque.map(item =>
                    API.update_stock(
                        item.produto,
                        item.quantidade_disponivel
                    )
                )
            );

            alert("Estoque atualizado com sucesso!");

        } catch (err) {
            console.error(err);
            alert("Erro ao salvar o estoque.");

        } finally {
            setSalvando(false);
        }
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

                <h1 className="text-xl font-bold mb-8 ml-2">
                    Editar estoque
                </h1>

                {/* Produtos existentes */}
                <div className={figmaStyles.stockGrid}>
                    {loading ? (
                        <p>Carregando estoque...</p>
                    ) : estoque.length === 0 ? (
                        <p>Nenhum produto cadastrado.</p>
                    ) : (
                        estoque.map(item => (
                            <label
                                key={item.id}
                                className={figmaStyles.label}
                            >
                                <span>{item.produto}:</span>

                                <input
                                    type="number"
                                    min="0"
                                    className={`${figmaStyles.input} mt-2`}
                                    value={item.quantidade_disponivel}
                                    onChange={e =>
                                        alterarQuantidade(
                                            item.id,
                                            e.target.value
                                        )
                                    }
                                />
                            </label>
                        ))
                    )}
                </div>

                {/* Adicionar produto */}
                <div className="mt-10 space-y-4">
                    <h2 className="font-bold">
                        Adicionar produto
                    </h2>

                    <input
                        type="text"
                        placeholder="Nome do produto"
                        className={figmaStyles.input}
                        value={novoProduto}
                        onChange={e =>
                            setNovoProduto(e.target.value)
                        }
                    />

                    <input
                        type="number"
                        min="0"
                        placeholder="Quantidade"
                        className={figmaStyles.input}
                        value={novaQuantidade}
                        onChange={e =>
                            setNovaQuantidade(e.target.value)
                        }
                    />

                    <button
                        onClick={adicionarProduto}
                        disabled={salvando}
                        className={`${figmaStyles.button} disabled:opacity-50`}
                    >
                        Adicionar produto
                    </button>
                </div>

                {/* Salvar */}
                <button
                    onClick={salvarAlteracoes}
                    disabled={loading || salvando}
                    className={`${figmaStyles.button} mt-10 disabled:opacity-50`}
                >
                    {salvando
                        ? "Salvando..."
                        : "Salvar alterações"}
                </button>
            </div>
        </>
    );
}