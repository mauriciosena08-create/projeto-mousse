"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";
import { usePerfil } from "@/lib/atoms/perfilAtom";

export default function Login() {
    const router = useRouter();
    const { definirPerfil } = usePerfil();

    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");

    async function entrar() {
        if (!nome || !senha) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            const API = api();

            const data = await API.login(nome, senha);

            // 1. Salva o perfil incluindo a propriedade 'tipo' retornada pelo backend
            const usuarioDados = {
                id: data.usuario.id,
                nome: data.usuario.nome,
                curso: data.usuario.curso,
                periodo: data.usuario.periodo,
                tipo: data.usuario.tipo, // <-- AQUI: Salva se é 'admin' ou 'comprador'
                senha,
            };

            definirPerfil(usuarioDados);

            // Também salvamos no localStorage para garantir persistência entre recarregamentos
            localStorage.setItem("usuario", JSON.stringify(usuarioDados));

            // 2. Redirecionamento condicional com base no tipo[cite: 7]
            if (data.usuario.tipo === "admin") {
                router.push("/admin"); // Redireciona para o painel de gerenciamento do admin
            } else {
                router.push("/perfil"); // Redireciona o comprador normal
            }
        } catch (err) {
            console.error(err);

            alert(
                err instanceof Error
                    ? err.message
                    : "Erro ao fazer login."
            );
        }
    }

    return (
        <section>
            <h1 className="font-bold text-center text-2xl my-10">
                Login
            </h1>

            <section className="space-y-5 flex flex-col items-center my-10">
                <article>
                    <label className="block mb-2" htmlFor="nome">
                        Nome:
                    </label>

                    <input
                        id="nome"
                        type="text"
                        placeholder="Digite seu nome"
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                    />
                </article>

                <article>
                    <label className="block mb-2" htmlFor="senha">
                        Senha:
                    </label>

                    <input
                        id="senha"
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(event) => setSenha(event.target.value)}
                    />
                </article>

                <button
                    onClick={entrar}
                    className="btn bg-cinza text-black font-semibold px-20 py-3 rounded-2xl cursor-pointer transition-colors"
                >
                    Entrar
                </button>

                <Link href="/cadastro" className="underline">
                    Não tenho cadastro
                </Link>
            </section>
        </section>
    );
}
