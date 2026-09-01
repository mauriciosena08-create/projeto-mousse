"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { usePerfil } from "@/lib/atoms/perfilAtom";
import Link from "next/link";

export default function Login() {
    const router = useRouter();
    const { definirPerfil } = usePerfil();

    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");

    function entrar() {
        if (!nome || !senha) {
            alert("Preencha todos os campos.");
            return;
        }

        // Depois você pode substituir isso por uma requisição à API
        definirPerfil({
            nome,
            curso: "Informática",
            periodo: "3",
            senha,
        });

        router.push("/perfil");
    }

    return (
        <section>
            <h1 className="font-bold text-center text-2xl my-10">
                Login
            </h1>

            <section className="space-y-5 flex flex-col items-center my-10">
                <article>
                    <label
                        className="block mb-2"
                        htmlFor="nome"
                    >
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
                    <label
                        className="block mb-2"
                        htmlFor="senha"
                    >
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
                <Link href="/cadastro" className="underline">Ainda não me cadastrei</Link>
            </section>
        </section>
    );
}