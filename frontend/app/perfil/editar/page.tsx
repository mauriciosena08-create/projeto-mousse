"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaCard, figmaStyles } from "@/components/FigmaPage";
import { usePerfil } from "@/lib/atoms/perfilAtom";

export default function EditarPerfil() {
    const router = useRouter();

    const {
        perfil,
        definirPerfil,
    } = usePerfil();

    const [nome, setNome] = useState("");
    const [curso, setCurso] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [senha, setSenha] = useState("");

    useEffect(() => {
        if (!perfil) {
            router.replace("/login");
            return;
        }

        setNome(perfil.nome);
        setCurso(perfil.curso);
        setPeriodo(perfil.periodo);
        setSenha(perfil.senha);
    }, [perfil, router]);

    function salvarAlteracoes() {
        if (!nome || !curso || !periodo || !senha) {
            alert("Preencha todos os campos.");
            return;
        }

        definirPerfil({
            nome,
            curso,
            periodo,
            senha,
        });

        alert("Perfil atualizado!");

        router.push("/perfil");
    }

    if (!perfil) {
        return null;
    }

    return (
        <div className={`${figmaStyles.page} h-full mx-auto overflow-auto`}>
            <h1 className={figmaStyles.title}>
                Editar perfil
            </h1>

            <FigmaCard className="text-center mb-8">
                <FigmaUserIcon />

                <h2 className="font-bold text-lg mt-2">
                    {nome}
                </h2>

                <p className="text-sm text-gray-500">
                    {curso} {periodo}º Período
                </p>
            </FigmaCard>

            <div className={figmaStyles.editGrid}>
                <label className={figmaStyles.label}>
                    <span className="flex items-center gap-2">
                        Nome:
                        <Pencil
                            size={14}
                            className="text-[--roxo-claro]"
                        />
                    </span>

                    <input
                        className={`${figmaStyles.input} mt-2`}
                        value={nome}
                        onChange={(event) =>
                            setNome(event.target.value)
                        }
                        type="text"
                    />
                </label>

                <label className={figmaStyles.label}>
                    <span className="flex items-center gap-2">
                        Curso:
                        <Pencil
                            size={14}
                            className="text-[--roxo-claro]"
                        />
                    </span>

                    <input
                        className={`${figmaStyles.input} mt-2`}
                        value={curso}
                        onChange={(event) =>
                            setCurso(event.target.value)
                        }
                        type="text"
                    />
                </label>

                <label className={figmaStyles.label}>
                    <span className="flex items-center gap-2">
                        Período:
                        <Pencil
                            size={14}
                            className="text-[--roxo-claro]"
                        />
                    </span>

                    <input
                        className={`${figmaStyles.input} mt-2`}
                        value={periodo}
                        onChange={(event) =>
                            setPeriodo(event.target.value)
                        }
                        type="text"
                    />
                </label>

                <label className={figmaStyles.label}>
                    <span className="flex items-center gap-2">
                        Senha:
                        <Pencil
                            size={14}
                            className="text-[--roxo-claro]"
                        />
                    </span>

                    <input
                        className={`${figmaStyles.input} mt-2`}
                        value={senha}
                        onChange={(event) =>
                            setSenha(event.target.value)
                        }
                        type="password"
                    />
                </label>
            </div>

            <button
                onClick={salvarAlteracoes}
                className={`${figmaStyles.button} mt-28`}
            >
                Salvar alterações
            </button>
        </div>
    );
}