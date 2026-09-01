import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type ProdutoProps = {
    produto: string;
    quant: number;
};

export const carrinhoAtom = atomWithStorage<ProdutoProps[]>(
    "carrinho",
    []
);

export function useCarrinho() {
    const [carrinho, setCarrinho] = useAtom(carrinhoAtom);

    function obterCarrinho() {
        return carrinho;
    }

    function adicionarProduto(produto: ProdutoProps) {
        setCarrinho((carrinho) => {
            const existente = carrinho.find(
                (item) => item.produto === produto.produto
            );

            if (existente) {
                return carrinho.map((item) =>
                    item.produto === produto.produto
                        ? {
                              ...item,
                              quant: item.quant + produto.quant,
                          }
                        : item
                );
            }

            return [...carrinho, produto];
        });
    }

    function retirarProduto(produto: ProdutoProps) {
        setCarrinho((carrinho) => {
            const existente = carrinho.find(
                (item) => item.produto === produto.produto
            );

            if (!existente) {
                return carrinho;
            }

            if (existente.quant <= produto.quant) {
                return carrinho.filter(
                    (item) => item.produto !== produto.produto
                );
            }

            return carrinho.map((item) =>
                item.produto === produto.produto
                    ? {
                          ...item,
                          quant: item.quant - produto.quant,
                      }
                    : item
            );
        });
    }

    function limparCarrinho() {
        setCarrinho([]);
    }

    return {
        carrinho,
        obterCarrinho,
        adicionarProduto,
        retirarProduto,
        limparCarrinho,
    };
}