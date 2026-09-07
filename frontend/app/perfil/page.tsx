"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function Perfil() {
    const [usuario, setUsuario] = useState<any>(null);
    const [meusPedidos, setMeusPedidos] = useState<any[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const usuarioSalvo = localStorage.getItem("usuario");
        if (usuarioSalvo) {
            try {
                const user = JSON.parse(usuarioSalvo);
                setUsuario(user);
                carregarPedidos(user);
            } catch (e) {
                console.error("Erro ao carregar usuário do localStorage", e);
            }
        } else {
            setCarregando(false);
        }
    }, []);

    async function carregarPedidos(userObj: any) {
        try {
            const API = api() as any;
            const response = await API.get_orders();
            const todosPedidos: any[] = Array.isArray(response) ? response : response?.pedidos || [];

            // Nome do usuário logado limpo
            const nomeUsuario = (userObj?.nome || userObj?.cliente || "").trim().toLowerCase();
            const idUsuario = userObj?.id;

            // Filtra pedidos comparando por ID ou por parte do Nome
            const filtrados = todosPedidos.filter((p: any) => {
                const clientePedido = (p.cliente || p.nome || "").trim().toLowerCase();
                const idPedido = p.usuario_id || p.cliente_id;

                // 1. Se tiver ID correspondente
                if (idUsuario && idPedido && String(idUsuario) === String(idPedido)) {
                    return true;
                }

                // 2. Se o nome do cliente for idêntico ou contiver o nome do usuário
                if (nomeUsuario && clientePedido && (clientePedido === nomeUsuario || clientePedido.includes(nomeUsuario) || nomeUsuario.includes(clientePedido))) {
                    return true;
                }

                return false;
            });

            setMeusPedidos(filtrados);
        } catch (err) {
            console.error("Erro ao buscar pedidos:", err);
        } finally {
            setCarregando(false);
        }
    }

    const handleDesconectar = () => {
        localStorage.removeItem("usuario");
        window.location.href = "/login";
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <h1 className="text-white text-xl font-bold mb-4">Perfil</h1>

            {usuario ? (
                <div className="w-full max-w-md space-y-4">
                    {/* Card de Informações do Usuário */}
                    <div className="bg-[#d9d9d9] text-black rounded-2xl p-6 text-center space-y-2">
                        <div className="w-16 h-16 bg-[#2d2538] rounded-full mx-auto flex items-center justify-center text-white text-2xl">
                            👤
                        </div>
                        <h2 className="font-bold text-lg uppercase tracking-wide">
                            {usuario.nome}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {usuario.curso} {usuario.periodo ? `${usuario.periodo}º Período` : ''}
                        </p>
                        
                        <Link 
                            href="/perfil/editar"
                            className="inline-block bg-[#3b2b43] text-white px-6 py-2 rounded-xl text-sm font-medium mt-2 hover:bg-[#2c2033] transition-colors"
                        >
                            Editar perfil ✏️
                        </Link>
                    </div>

                    {/* Card de Meus Pedidos */}
                    <div className="bg-[#d9d9d9] text-black rounded-2xl p-6 text-center">
                        <h3 className="font-semibold text-lg mb-3">Meus pedidos</h3>
                        
                        {carregando ? (
                            <p className="text-gray-500 text-sm">Carregando...</p>
                        ) : meusPedidos.length > 0 ? (
                            <div className="space-y-3 text-left max-h-60 overflow-y-auto pr-1">
                                {meusPedidos.map((pedido) => {
                                    let itens: any[] = [];
                                    try {
                                        itens = typeof pedido.itens === "string" ? JSON.parse(pedido.itens) : pedido.itens;
                                    } catch (e) {
                                        itens = [];
                                    }

                                    return (
                                        <div key={pedido.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                                            <div className="flex justify-between items-center border-b pb-1 mb-2">
                                                <span className="font-bold text-sm">Pedido #{pedido.id}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                                    pedido.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {pedido.status || 'Pendente'}
                                                </span>
                                            </div>
                                            
                                            <div className="text-xs text-gray-700 space-y-1">
                                                {itens && itens.map((item: any, idx: number) => (
                                                    <div key={idx}>
                                                        • {item.quantidade || item.quant}x {item.produto || item.nome}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="text-[10px] text-gray-400 mt-2 text-right">
                                                {pedido.data}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Nenhum pedido encontrado.</p>
                        )}
                    </div>

                    {/* Botão Desconectar */}
                    <button
                        onClick={handleDesconectar}
                        className="w-full bg-[#d9d9d9] text-black font-medium py-3 rounded-2xl hover:bg-gray-300 transition-colors"
                    >
                        Desconectar
                    </button>
                </div>
            ) : (
                <div className="text-center text-white space-y-4">
                    <p>Você precisa estar conectado para acessar o perfil.</p>
                    <Link href="/login" className="inline-block bg-white text-black px-6 py-2 rounded-xl font-bold">
                        Fazer Login
                    </Link>
                </div>
            )}
        </section>
    );
}
