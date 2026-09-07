
const API_URL = "/api-php";
export default function api() {

    // =========================
    // ESTOQUE
    // =========================

    async function get_stock() {
        try {
            const response = await fetch(
                `${API_URL}/get_stock.php`
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar estoque.");
            }

            return await response.json();

        } catch (err) {
            console.error(
                "Erro ao buscar estoque:",
                err
            );

            throw err;
        }
    }

    async function add_stock(
        produto: string,
        quantidade: number
    ) {
        try {
            const response = await fetch(
                `${API_URL}/add_stock.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        produto,
                        quantidade,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao adicionar estoque."
                );
            }

            return data;

        } catch (err) {
            console.error(
                "Erro ao adicionar estoque:",
                err
            );

            throw err;
        }
    }

    async function update_stock(
        produto: string,
        quantidade: number
    ) {
        try {
            const response = await fetch(
                `${API_URL}/update_stock.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        produto,
                        quantidade,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao atualizar estoque."
                );
            }

            return data;

        } catch (err) {
            console.error(
                "Erro ao atualizar estoque:",
                err
            );

            throw err;
        }
    }

    async function delete_stock(id: number) {
        try {
            const response = await fetch(
                `${API_URL}/delete_stock.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao remover produto."
                );
            }

            return data;

        } catch (err) {
            console.error(
                "Erro ao remover produto:",
                err
            );

            throw err;
        }
    }


    // =========================
    // PEDIDOS
    // =========================

    async function add_order(
        usuario_id: number,
        itens: {
            produto_id: number;
            quantidade: number;
        }[]
    ) {
        try {
            const response = await fetch(
                `${API_URL}/add_order.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        usuario_id,
                        itens,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao realizar pedido."
                );
            }

            return data;

        } catch (err) {
            console.error(
                "Erro ao realizar pedido:",
                err
            );

            throw err;
        }
    }

    async function get_orders() {
        try {
            const response = await fetch(
                `${API_URL}/get_orders.php`
            );

            if (!response.ok) {
                throw new Error(
                    "Erro ao buscar pedidos."
                );
            }

            return await response.json();

        } catch (err) {
            console.error(
                "Erro ao buscar pedidos:",
                err
            );

            throw err;
        }
    }

    async function finish_order(id: number) {
        try {
            const response = await fetch(
                `${API_URL}/finish_order.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao finalizar pedido."
                );
            }

            return data;

        } catch (err) {
            console.error(
                "Erro ao finalizar pedido:",
                err
            );

            throw err;
        }
    }


    // =========================
    // USUÁRIOS
    // =========================

    async function register(
        nome: string,
        senha: string,
        curso: string,
        periodo: string
    ) {
        try {
            const response = await fetch(
                `${API_URL}/register.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome,
                        senha,
                        curso,
                        periodo,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao cadastrar."
                );
            }

            return data;

        } catch (err) {
            console.error(
                "Erro ao cadastrar:",
                err
            );

            throw err;
        }
    }

    async function login(
        nome: string,
        senha: string
    ) {
        try {
            const response = await fetch(
                `${API_URL}/login.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nome,
                        senha,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao fazer login."
                );
            }

            return data;

        } catch (err) {
            console.error(
                "Erro ao fazer login:",
                err
            );

            throw err;
        }
    }


    // =========================
    // GASTOS
    // =========================

    async function expenses(
        produto_id: number,
        quantidade: number,
        valor: number
    ) {
        try {
            const response = await fetch(
                `${API_URL}/expenses.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        produto_id,
                        quantidade,
                        valor,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.mensagem ||
                    "Erro ao registrar gasto."
                );
            }

            return data;

        } catch (err) {
            console.error(
                "Erro ao registrar gasto:",
                err
            );

            throw err;
        }
    }

    async function get_expenses() {
        try {
            const response = await fetch(
                `${API_URL}/get_expenses.php`
            );

            if (!response.ok) {
                throw new Error(
                    "Erro ao buscar gastos."
                );
            }

            return await response.json();

        } catch (err) {
            console.error(
                "Erro ao buscar gastos:",
                err
            );

            throw err;
        }
    }


    return {
        get_stock,
        add_stock,
        update_stock,
        delete_stock,

        add_order,
        get_orders,
        finish_order,

        register,
        cadastrar: register,
        login,

        expenses,
        get_expenses,
    };
}
