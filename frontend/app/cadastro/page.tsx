
export default function Cadastro() {
    return (
        <div className="">

            <div className="rounded-3xl border border-gray-200 p-8 w-full max-w-md">

                <h1 className="font-bold text-center text-2xl mb-8">
                    Cadastro
                </h1>

                <section className="space-y-5 flex flex-col">

                    <article>
                        <label className="block mb-2" htmlFor="nome">
                            Nome:
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-xl px-4 py-2"
                            id="nome"
                            type="text"
                            placeholder="Digite seu nome"
                        />
                    </article>

                    <article>
                        <label className="block mb-2" htmlFor="curso">
                            Curso:
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-xl px-4 py-2"
                            id="curso"
                            type="text"
                            placeholder="Digite seu curso"
                        />
                    </article>

                    <article>
                        <label className="block mb-2" htmlFor="periodo">
                            Período:
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-xl px-4 py-2"
                            id="periodo"
                            type="text"
                            placeholder="Digite seu período"
                        />
                    </article>

                    <article>
                        <label className="block mb-2" htmlFor="senha">
                            Senha:
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-xl px-4 py-2"
                            id="senha"
                            type="password"
                            placeholder="Digite sua senha"
                        />
                    </article>

                    <article>
                        <label className="block mb-2" htmlFor="confirmarSenha">
                            Confirmar senha:
                        </label>
                        <input
                            className="w-full border border-gray-300 rounded-xl px-4 py-2"
                            id="confirmarSenha"
                            type="password"
                            placeholder="Confirme sua senha"
                        />
                    </article>

                    <button
                        className="btn bg-cinza text-black font-semibold w-full py-3 rounded-2xl cursor-pointer transition-colors"
                    >
                        Cadastrar
                    </button>

                </section>
            </div>
        </div>
    )
}