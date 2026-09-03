"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/api";

export default function Cadastro() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [curso, setCurso] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    async function cadastrar() {
        if (!nome || !curso || !periodo || !senha || !confirmarSenha) {
            alert("Preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            alert("As senhas não são iguais.");
            return;
        }

        try {
            const API = api();

            await API.cadastrar(
                nome,
                senha,
                curso,
                periodo
            );

            alert("Cadastro realizado com sucesso!");

            router.push("/login");

        } catch (err) {
            console.error(err);

            alert(
                err instanceof Error
                    ? err.message
                    : "Erro ao realizar cadastro."
            );
        }
    }

    return (
        <section>
            <h1 className="font-bold text-center text-2xl my-10">
                Cadastro
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
                    <label className="block mb-2" htmlFor="curso">
                        Curso:
                    </label>

                    <input
                        id="curso"
                        type="text"
                        placeholder="Digite seu curso"
                        value={curso}
                        onChange={(event) => setCurso(event.target.value)}
                    />
                </article>

                <article>
                    <label className="block mb-2" htmlFor="periodo">
                        Período:
                    </label>

                    <input
                        id="periodo"
                        type="text"
                        placeholder="Digite seu período"
                        value={periodo}
                        onChange={(event) => setPeriodo(event.target.value)}
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

                <article>
                    <label
                        className="block mb-2"
                        htmlFor="confirmarSenha"
                    >
                        Confirmar senha:
                    </label>

                    <input
                        id="confirmarSenha"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={confirmarSenha}
                        onChange={(event) =>
                            setConfirmarSenha(event.target.value)
                        }
                    />
                </article>

                <button
                    onClick={cadastrar}
                    className="btn bg-cinza text-black font-semibold px-20 py-3 rounded-2xl cursor-pointer transition-colors"
                >
                    Cadastrar
                </button>

                <Link href="/login" className="underline">
                    Já tenho login
                </Link>
            </section>
        </section>
    );
}