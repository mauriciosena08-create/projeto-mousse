"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

import { useCarrinho } from "@/lib/atoms/carrinhoAtom";

interface Props {
    title: string;
    description: string;
    btnAdd?: boolean;
    inCart?: boolean;
}

export default function Product({
    title,
    description,
    btnAdd = false,
    inCart = false,
}: Props) {
    const {
        carrinho,
        adicionarProduto,
        retirarProduto,
    } = useCarrinho();

    const produtoCarrinho = carrinho.find(
        (item) => item.produto === title
    );

    const [quant, setQuant] = useState(1);

    const quantCarrinho = produtoCarrinho?.quant ?? 0;

    function adicionarAoCarrinho() {
        adicionarProduto({
            produto: title,
            quant,
        });
    }

    function lessQuant() {
        if (inCart) {
            retirarProduto({
                produto: title,
                quant: 1,
            });

            return;
        }

        setQuant((prev) => Math.max(1, prev - 1));
    }

    function moreQuant() {
        if (inCart) {
            adicionarProduto({
                produto: title,
                quant: 1,
            });

            return;
        }

        setQuant((prev) => prev + 1);
    }

    return (
        <article className="flex gap-5 rounded-2xl p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

            {/* Imagem */}
            <div className="flex aspect-square w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                <span className="text-sm font-medium text-gray-400">
                    Sem imagem
                </span>
            </div>

            {/* Informações */}
            <div className="flex flex-col justify-between gap-4">

                <div>
                    <h2 className="truncate text-lg text-white font-bold">
                        {title || "Produto indefinido"}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white">
                        {description || "Nenhuma descrição disponível."}
                    </p>
                </div>

                {/* Quantidade */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 p-1">

                        <button
                            type="button"
                            onClick={lessQuant}
                            disabled={inCart ? quantCarrinho === 0 : quant === 1}
                            aria-label="Diminuir quantidade"
                            className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 active:scale-90 disabled:opacity-30"
                        >
                            <Minus size={16} strokeWidth={2.5} />
                        </button>

                        <span className="min-w-6 text-center text-sm font-bold text-gray-900">
                            {inCart ? quantCarrinho : quant}
                        </span>

                        <button
                            type="button"
                            onClick={moreQuant}
                            aria-label="Aumentar quantidade"
                            className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-roxo text-white shadow-sm transition hover:brightness-110 active:scale-90"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                        </button>

                    </div>
                </div>

                {/* Só aparece fora do carrinho */}
                {btnAdd && !inCart && (
                    <button
                        className="bg-gray-500 px-2 py-4 rounded-2xl cursor-pointer"
                        onClick={adicionarAoCarrinho}
                    >
                        Adicionar ao carrinho
                    </button>
                )}
            </div>
        </article>
    );
}