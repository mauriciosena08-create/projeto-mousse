"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaCard, figmaStyles } from "@/components/FigmaPage";

import { usePerfil } from "@/lib/atoms/perfilAtom";
import api from "@/lib/api";

type Pedido = {
  id: number;
  produto: string;
  data: string;
};

type Estoque = {
  produto: string;
  quant?: number;
  quantidade_disponivel?: number;
};

export default function Admin() {
  const { perfil } = usePerfil();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estoque, setEstoque] = useState<Estoque[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const API = api();

        const [ordersRes, stockRes] = await Promise.all([
          API.get_orders().catch(() => null),
          API.get_stock().catch(() => null),
        ]);

        // Trata a resposta de pedidos
        if (Array.isArray(ordersRes)) {
          setPedidos(ordersRes);
        } else if (ordersRes && Array.isArray(ordersRes.pedidos)) {
          setPedidos(ordersRes.pedidos);
        } else {
          setPedidos([]);
        }

        // Trata a resposta de estoque
        if (Array.isArray(stockRes)) {
          setEstoque(stockRes);
        } else if (stockRes && Array.isArray(stockRes.produtos)) {
          setEstoque(stockRes.produtos);
        } else {
          setEstoque([]);
        }
      } catch (err) {
        console.error("Erro ao carregar painel:", err);
        setPedidos([]);
        setEstoque([]);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const sair = () => {
    // Aqui você pode limpar o perfil
    // e futuramente redirecionar para login
  };

  const totalEstoque = Array.isArray(estoque)
    ? estoque.reduce((total, item) => {
        const qtd = item.quant ?? item.quantidade_disponivel ?? 0;
        return total + Number(qtd);
      }, 0)
    : 0;

  const totalPedidos = Array.isArray(pedidos) ? pedidos.length : 0;

  return (
    <div
      className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto`}
    >
      {/* PERFIL */}
      <div className={figmaStyles.profileHead}>
        <FigmaUserIcon />

        <span>
          {perfil?.nome
            ? `${perfil.nome}.`
            : "Admin."}
        </span>
      </div>

      {/* ESTATÍSTICAS */}
      <div className={figmaStyles.adminStats}>
        <div className={figmaStyles.adminStat}>
          <label>N° de Pedidos:</label>

          <input
            className={figmaStyles.input}
            value={loading ? "..." : totalPedidos}
            readOnly
          />
        </div>

        <div className={figmaStyles.adminStat}>
          <label>
            Estoque:{" "}
            <Link
              href="/admin/estoque"
              className="text-[--roxo-claro]"
            >
              ✎
            </Link>
          </label>

          <input
            className={figmaStyles.input}
            value={loading ? "..." : totalEstoque}
            readOnly
          />
        </div>
      </div>

      {/* PEDIDOS */}
      <FigmaCard>
        <h2 className="text-center font-bold text-lg mb-4">
          Pedidos
        </h2>

        {loading ? (
          <p className="text-center opacity-60">
            Carregando pedidos...
          </p>
        ) : !Array.isArray(pedidos) || pedidos.length === 0 ? (
          <p className="text-center opacity-60">
            Nenhum pedido encontrado.
          </p>
        ) : (
          <div className="space-y-2">
            {pedidos.map((pedido) => (
              <Link
                href={`/admin/pedidos/${pedido.id}`}
                className={`${figmaStyles.orderItem} block`}
                key={pedido.id}
              >
                <strong>{pedido.produto}</strong>

                <small>
                  Clique para ver mais...
                </small>

                <span className={figmaStyles.orderDate}>
                  {pedido.data}
                </span>
              </Link>
            ))}
          </div>
        )}
      </FigmaCard>

      {/* SAIR */}
      <button
        onClick={sair}
        className={`${figmaStyles.button} mt-5`}
      >
        Sair
      </button>
    </div>
  );
}
