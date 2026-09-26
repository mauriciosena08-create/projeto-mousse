"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  id?: number;
  produto: string;
  quant?: number;
  quantidade_disponivel?: number;
  imagem?: string;
};

export default function AdminOuPerfil() {
  const { perfil, setPerfil } = usePerfil();
  const router = useRouter();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [estoque, setEstoque] = useState<Estoque[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados do formulário de novo produto no estoque
  const [novoProduto, setNovoProduto] = useState("");
  const [novaQuantidade, setNovaQuantidade] = useState(1);
  const [novaImagem, setNovaImagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const isAdmin = perfil?.tipo === "admin";

  const carregarDados = async () => {
    try {
      setLoading(true);
      const API = api();

      const [ordersRes, stockRes] = await Promise.all([
        API.get_orders().catch(() => null),
        API.get_stock().catch(() => null),
      ]);

      if (Array.isArray(ordersRes)) {
        setPedidos(ordersRes);
      } else if (ordersRes && Array.isArray(ordersRes.pedidos)) {
        setPedidos(ordersRes.pedidos);
      } else {
        setPedidos([]);
      }

      if (Array.isArray(stockRes)) {
        setEstoque(stockRes);
      } else if (stockRes && Array.isArray(stockRes.produtos)) {
        setEstoque(stockRes.produtos);
      } else if (stockRes && Array.isArray(stockRes.estoque)) {
        setEstoque(stockRes.estoque);
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
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleAdicionarEstoque = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoProduto.trim()) return;

    try {
      setEnviando(true);
      setMensagem(null);
      const API = api();

      // Envia os dados para a API do backend
      if (typeof API.save_stock === "function") {
        await API.save_stock({
          produto: novoProduto,
          quantidade_disponivel: novaQuantidade,
          imagem: novaImagem,
        });
      } else {
        // Fallback fetch direto caso o método no lib/api.ts tenha nome diferente
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://projeto-mousse.onrender.com";
        await fetch(`${backendUrl}/save_stock.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produto: novoProduto,
            quantidade_disponivel: novaQuantidade,
            imagem: novaImagem,
          }),
        });
      }

      setMensagem("Produto adicionado com sucesso ao estoque!");
      setNovoProduto("");
      setNovaQuantidade(1);
      setNovaImagem("");
      carregarDados(); // Recarrega os totais e lista
    } catch (err) {
      console.error("Erro ao adicionar estoque:", err);
      setMensagem("Erro ao salvar produto no estoque.");
    } finally {
      setEnviando(false);
    }
  };

  const sair = () => {
    if (typeof setPerfil === "function") {
      setPerfil(null);
    }
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  const totalEstoque = Array.isArray(estoque)
    ? estoque.reduce((total, item) => {
        const qtd = item.quant ?? item.quantidade_disponivel ?? 0;
        return total + Number(qtd);
      }, 0)
    : 0;

  const totalPedidos = Array.isArray(pedidos) ? pedidos.length : 0;

  // VISÃO DE USUÁRIO COMUM / COMPRADOR
  if (!isAdmin) {
    return (
      <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto p-5 text-center text-white`}>
        <div className={figmaStyles.profileHead}>
          <FigmaUserIcon />
          <span className="text-xl font-bold">{perfil?.nome || "Comprador"}</span>
        </div>

        <FigmaCard className="mt-5 p-5">
          <h2 className="font-bold text-lg mb-2">Sua Conta</h2>
          <p className="text-sm opacity-80">Curso: {perfil?.curso || "N/A"}</p>
          <p className="text-sm opacity-80">Período: {perfil?.periodo || "N/A"}</p>
        </FigmaCard>

        <button onClick={sair} className={`${figmaStyles.button} mt-5 bg-red-600`}>
          Sair da Conta
        </button>
      </div>
    );
  }

  // VISÃO DE ADMINISTRADOR
  return (
    <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto space-y-5 p-5`}>
      {/* PERFIL */}
      <div className={figmaStyles.profileHead}>
        <FigmaUserIcon />
        <span>{perfil?.nome ? `${perfil.nome} (Admin)` : "Admin"}</span>
      </div>

      {/* ESTATÍSTICAS */}
      <div className={figmaStyles.adminStats}>
        <div className={figmaStyles.adminStat}>
          <label>N° de Pedidos:</label>
          <input className={figmaStyles.input} value={loading ? "..." : totalPedidos} readOnly />
        </div>

        <div className={figmaStyles.adminStat}>
          <label>Total em Estoque:</label>
          <input className={figmaStyles.input} value={loading ? "..." : totalEstoque} readOnly />
        </div>
      </div>

      {/* PAINEL: ADICIONAR AO ESTOQUE */}
      <FigmaCard>
        <h2 className="text-center font-bold text-lg mb-4 text-white">Adicionar Produto ao Estoque</h2>
        
        {mensagem && (
          <p className="text-center text-sm mb-3 text-green-400 font-bold">{mensagem}</p>
        )}

        <form onSubmit={handleAdicionarEstoque} className="space-y-3">
          <div>
            <label className="block text-xs text-white mb-1">Nome do Doce/Produto</label>
            <input
              type="text"
              placeholder="Ex: Mousse de Morango"
              value={novoProduto}
              onChange={(e) => setNovoProduto(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 text-sm"
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-xs text-white mb-1">Quantidade</label>
              <input
                type="number"
                min="1"
                value={novaQuantidade}
                onChange={(e) => setNovaQuantidade(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 text-sm"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-xs text-white mb-1">URL da Imagem (Opcional)</label>
              <input
                type="text"
                placeholder="https://..."
                value={novaImagem}
                onChange={(e) => setNovaImagem(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition text-sm disabled:opacity-50"
          >
            {enviando ? "Salvando..." : "+ Cadastrar no Estoque"}
          </button>
        </form>
      </FigmaCard>

      {/* LISTA DE PEDIDOS */}
      <FigmaCard>
        <h2 className="text-center font-bold text-lg mb-4 text-white">Pedidos Recebidos</h2>

        {loading ? (
          <p className="text-center opacity-60 text-white">Carregando pedidos...</p>
        ) : !Array.isArray(pedidos) || pedidos.length === 0 ? (
          <p className="text-center opacity-60 text-white">Nenhum pedido encontrado.</p>
        ) : (
          <div className="space-y-2">
            {pedidos.map((pedido) => (
              <Link
                href={`/admin/pedidos/${pedido.id}`}
                className={`${figmaStyles.orderItem} block`}
                key={pedido.id}
              >
                <strong>{pedido.produto}</strong>
                <small>Clique para ver detalhes...</small>
                <span className={figmaStyles.orderDate}>{pedido.data}</span>
              </Link>
            ))}
          </div>
        )}
      </FigmaCard>

      {/* SAIR */}
      <button onClick={sair} className={`${figmaStyles.button} mt-5 bg-red-600 text-white w-full py-2 rounded-xl`}>
        Sair
      </button>
    </div>
  );
}
