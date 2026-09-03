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
  quant: number;
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

        const [orders, stock] = await Promise.all([
          API.get_orders(),
          API.get_stock(),
        ]);

        setPedidos(orders);
        setEstoque(stock);
      } catch (err) {
        console.error("Erro ao carregar painel:", err);
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
            value={loading ? "..." : pedidos.length}
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
            value={
              loading
                ? "..."
                : estoque.reduce(
                    (total, item) => total + Number(item.quant),
                    0
                  )
            }
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
        ) : pedidos.length === 0 ? (
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