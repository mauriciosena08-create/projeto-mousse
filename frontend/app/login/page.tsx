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

            definirPerfil({
                nome: data.usuario.nome,
                curso: data.usuario.curso,
                periodo: data.usuario.periodo,
                senha,
            });

            router.push("/perfil");
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