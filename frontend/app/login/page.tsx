export default function Login() {
    return (
        <div className=" flex items-center justify-center px-4">

            <div className="rounded-3xl border border-gray-200 shadow-lg p-8 w-full max-w-md">

                <h1 className="font-bold text-center text-2xl mb-8">
                    Login
                </h1>

                <section className="space-y-5 flex flex-col">

                    <article>
                        <label
                            className="block mb-2"
                            htmlFor="nome"
                        >
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
                        <label
                            className="block mb-2"
                            htmlFor="senha"
                        >
                            Senha:
                        </label>

                        <input
                            className="w-full border border-gray-300 rounded-xl px-4 py-2"
                            id="senha"
                            type="password"
                            placeholder="Digite sua senha"
                        />
                    </article>

                    <button
                        className="btn bg-cinza text-black font-semibold w-full py-3 rounded-2xl cursor-pointer transition-colors"
                    >
                        Entrar
                    </button>

                    <a
                        className="text-cinza text-xs font-semibold text-center cursor-pointer transition-colors"
                        href="/cadastro"
                    >
                        Faltou açúcar na sua vida? Cadastre-se e descubra nossas delícias!
                    </a>

                </section>
            </div>
        </div>
    )
}