export default function Cadastro() {
    return (
        <>
            <h1 className="font-bold text-center text-2xl my-10">Cadastro</h1>
            <section className="space-y-5 flex flex-col items-center my-10">
                <article>
                    <label className="block mb-2" htmlFor="nome">Nome:</label>
                    <input id="nome" type="text" placeholder="Digite seu nome" />
                </article>
                <article>
                    <label className="block mb-2" htmlFor="curso">Curso:</label>
                    <input id="curso" type="text" placeholder="Digite seu curso" />
                </article>
                <article>
                    <label className="block mb-2" htmlFor="periodo">Periodo:</label>
                    <input id="periodo" type="text" placeholder="Digite seu periodo" />
                </article>
                <article>
                    <label className="block mb-2" htmlFor="senha">Senha:</label>
                    <input id="senha" type="password" placeholder="Digite sua senha" />
                </article>
                <article>
                    <label className="block mb-2" htmlFor="confirmarSenha">Confirmar senha:</label>
                    <input id="confirmarSenha" type="password" placeholder="Confirme sua senha" />
                </article>
                <button className="btn bg-cinza text-black font-semibold px-20 py-3 rounded-2xl cursor-pointer transition-colors">Cadastrar</button>
            </section>
        </>
    )
}