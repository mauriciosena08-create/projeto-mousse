"use client";

import Link from "next/link";
import { Pencil, Package } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaCard, figmaStyles } from "@/components/FigmaPage";
import { usePerfil } from "@/lib/atoms/perfilAtom";

export default function Perfil() {
    const router = useRouter();

    const {
        perfil,
        limparPerfil,
    } = usePerfil();

    useEffect(() => {
        if (!perfil) {
            router.replace("/login");
        }
    }, [perfil, router]);

    function desconectar() {
        localStorage.removeItem("usuario");
        limparPerfil();
        router.replace("/login");
    }

    if (!perfil) {
        return null;
    }

    return (
        <div className={`${figmaStyles.page} h-full mx-auto overflow-auto`}>
            <h1 className={figmaStyles.title}>
                Perfil
            </h1>

            <FigmaCard className="text-center">
                <FigmaUserIcon />

                <h2 className="font-bold text-lg mt-2">
                    {perfil.nome}
                </h2>

                <p className="text-sm text-gray-500">
                    {perfil.curso} {perfil.periodo}º Período
                </p>

                {/* Botão visível APENAS para administradores */}
                {perfil.tipo === "admin" && (
                    <Link
                        href="/admin"
                        className={`${figmaStyles.button} bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 mt-4 font-bold`}
                    >
                        Gerenciar Estoque
                        <Package size={16} />
                    </Link>
                )}

                <Link
                    href="/perfil/editar"
                    className={`${figmaStyles.button} ${figmaStyles.purpleButton} flex items-center justify-center gap-2 mt-3`}
                >
                    Editar perfil
                    <Pencil size={16} />
                </Link>
            </FigmaCard>

            <FigmaCard className="mt-5">
                <h2 className="text-center font-bold text-lg mb-3">
                    Meus pedidos
                </h2>

                <div className="space-y-3">
                    <p className="text-center text-gray-500">
                        Nenhum pedido encontrado.
                    </p>
                </div>
            </FigmaCard>

            <button
                onClick={desconectar}
                className={`${figmaStyles.button} mt-5`}
            >
                Desconectar
            </button>
        </div>
    );
}
