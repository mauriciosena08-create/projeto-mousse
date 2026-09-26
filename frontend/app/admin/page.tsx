"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { figmaStyles } from "@/components/FigmaPage";

import { usePerfil } from "@/lib/atoms/perfilAtom";
import api from "@/lib/api";

type Pedido = {
  id: number;
  produto?: string;
  data: string;
  status?: string;
  concluido?: boolean | number;
};

type Estoque = {
  id?: number;
  produto: string;
  quant?: number;
  quantidade_disponivel?: number;
  imagem?: string;
};

export default function AdminOuPerfil() {
  const { perfil, definirPerfil } = usePerfil() as any;
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

  const perfilQualquer = perfil as any;
  const isAdmin = perfilQualquer?.tipo === "admin";

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
      const API = api() as any;

      if (typeof API.add_stock === "function") {
        await API.add_stock(novoProduto, novaQuantidade, novaImagem);
      } else {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://projeto-mousse.onrender.com";
        await fetch(`${backendUrl}/add_stock.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            produto: novoProduto,
            quantidade: novaQuantidade,
            imagem: novaImagem,
          }),
        });
      }

      setMensagem("Produto adicionado com sucesso ao estoque!");
      setNovoProduto("");
      setNovaQuantidade(1);
      setNovaImagem("");
      carregarDados();
    } catch (err) {
      console.error("Erro ao adicionar estoque:", err);
      setMensagem("Erro ao salvar produto no estoque.");
    } finally {
      setEnviando(false);
    }
  };

  const sair = () => {
    if (typeof definirPerfil === "function") {
      definirPerfil(null);
    }
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  // Filtra apenas os pedidos PENDENTES (não concluídos)
  const pedidosPendentes = Array.isArray(pedidos)
    ? pedidos.filter(
        (p) =>
          p.status !== "Concluído" &&
          p.status !== "Concluido" &&
          p.status !== "Entregue" &&
          p.status !== "concluido" &&
          !p.concluido
      )
    : [];

  const totalEstoque = Array.isArray(estoque)
    ? estoque.reduce((total, item) => {
        const qtd = item.quant ?? item.quantidade_disponivel ?? 0;
        return total + Number(qtd);
      }, 0)
    : 0;

  const totalPedidos = pedidosPendentes.length;

  // VISÃO DE USUÁRIO COMUM / COMPRADOR
  if (!isAdmin) {
    return (
      <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto p-5 text-center text-white`}>
        <div className={figmaStyles.profileHead}>
          <FigmaUserIcon />
          <span className="text-xl font-bold">{perfilQualquer?.nome || "Comprador"}</span>
        </div>

        <div className="mt-5 p-5 bg-purple-900/60 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white">
          <h2 className="font-bold text-lg mb-2 text-white">Sua Conta</h2>
          <p className="text-sm opacity-80">Curso: {perfilQualquer?.curso || "N/A"}</p>
          <p className="text-sm opacity-80">Período: {perfilQualquer?.periodo || "N/A"}</p>
        </div>

        <button onClick={sair} className="w-full mt-5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition">
          Sair da Conta
        </button>
      </div>
    );
  }

  // VISÃO DE ADMINISTRADOR
  return (
    <div className={`${figmaStyles.adminContent} max-w-md h-full mx-auto overflow-auto space-y-5 p-5 text-white`}>
      {/* PERFIL */}
      <div className="flex items-center gap-3 justify-center mb-2">
        <FigmaUserIcon />
        <span className="text-xl font-bold text-white">
          {perfilQualquer?.nome ? `${perfilQualquer.nome} (Admin)` : "Admin"}
        </span>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold mb-1 text-white">N° de Pedidos:</label>
          <div className="w-full bg-purple-900/60 border border-purple-500/30 text-white font-bold text-center py-2 rounded-xl">
            {loading ? "..." : totalPedidos}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <label className="text-sm font-semibold mb-1 text-white">Total em Estoque:</label>
          <div className="w-full bg-purple-900/60 border border-purple-500/30 text-white font-bold text-center py-2 rounded-xl">
            {loading ? "..." : totalEstoque}
          </div>
        </div>
      </div>

      {/* PAINEL: ADICIONAR AO ESTOQUE */}
      <div className="bg-purple-900/60 backdrop-blur-sm border border-purple-500/30 p-5 rounded-2xl shadow-lg">
        <h2 className="text-center font-bold text-lg mb-4 text-white">
          Adicionar Produto ao Estoque
        </h2>

        {mensagem && (
          <p className="text-center text-sm mb-3 text-green-400 font-bold">{mensagem}</p>
        )}

        <form onSubmit={handleAdicionarEstoque} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-white mb-1">
              Nome do Doce/Produto
            </label>
            <input
              type="text"
              placeholder="Ex: Mousse de Morango"
              value={novoProduto}
              onChange={(e) => setNovoProduto(e.target.value)}
              className="w-full p-2 rounded-lg bg-purple-950/80 text-white placeholder-purple-300/50 border border-purple-400/30 text-sm focus:outline-none focus:border-purple-400"
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-xs font-medium text-white mb-1">Quantidade</label>
              <input
                type="number"
                min="1"
                value={novaQuantidade}
                onChange={(e) => setNovaQuantidade(Number(e.target.value))}
                className="w-full p-2 rounded-lg bg-purple-950/80 text-white border border-purple-400/30 text-sm focus:outline-none focus:border-purple-400"
                required
              />
            </div>

            <div className="w-1/2">
              <label className="block text-xs font-medium text-white mb-1">URL da Imagem (Opcional)</label>
              <input
                type="text"
                placeholder="https://..."
                value={novaImagem}
                onChange={(e) => setNovaImagem(e.target.value)}
                className="w-full p-2 rounded-lg bg-purple-950/80 text-white placeholder-purple-300/50 border border-purple-400/30 text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition text-sm mt-2 disabled:opacity-50 shadow-md"
          >
            {enviando ? "Salvando..." : "+ Cadastrar no Estoque"}
          </button>
        </form>
      </div>

      {/* LISTA DE PEDIDOS RECEBIDOS */}
      <div className="bg-purple-900/60 backdrop-blur-sm border border-purple-500/30 p-5 rounded-2xl shadow-lg">
        <h2 className="text-center font-bold text-lg mb-4 text-white">Pedidos Recebidos</h2>

        {loading ? (
          <p className="text-center opacity-70 text-white">Carregando pedidos...</p>
        ) : pedidosPendentes.length === 0 ? (
          <p className="text-center opacity-70 text-white">Nenhum pedido pendente encontrado.</p>
        ) : (
          <div className="space-y-2">
            {pedidosPendentes.map((pedido) => (
              <Link
                href={`/admin/pedidos/${pedido.id}`}
                className="block p-3 rounded-xl bg-purple-950/60 hover:bg-purple-950 border border-purple-400/20 text-white transition"
                key={pedido.id}
              >
                <div className="flex justify-between items-center">
                  <strong>{pedido.produto || `Pedido #${pedido.id}`}</strong>
                  <span className="text-xs opacity-70">{pedido.data}</span>
                </div>
                <small className="text-xs text-purple-200 block mt-1">Clique para ver detalhes...</small>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* SAIR */}
      <button
        onClick={sair}
        className="w-full bg-purple-900/60 hover:bg-red-600 border border-purple-500/30 text-white py-3 rounded-2xl font-bold transition shadow-md"
      >
        Sair
      </button>
    </div>
  );
}
