export default function Login() {
    return (
        <main className="text-white">
            <h1 className="font-bold text-center text-2xl my-10">Login</h1>
            <section className="space-y-5 flex flex-col items-center my-10">
                <article>
                    <label className="block mb-2" htmlFor="nome">Nome:</label>
                    <input id="nome" type="text" placeholder="Digite seu nome" />
                </article>
                <article>
                    <label className="block mb-2" htmlFor="senha">Senha:</label>
                    <input id="senha" type="password" placeholder="Digite sua senha" />
                </article>
                <button className="btn bg-cinza text-black font-semibold px-20 py-3 rounded-2xl cursor-pointer transition-colors">Entrar</button>
            </section>
        </main>
    )
}