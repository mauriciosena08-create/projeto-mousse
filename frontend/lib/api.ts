const API_URL = "https://projeto-mousse.freehosting.dev/API";

export default function api() {
    // GET
    async function get_stock() {
        try {            
            const data = await fetch(`${API_URL}/get_stock.php`)
                .then(d => JSON.stringify(d));
            
            return data;
        } catch (err) {
            console.error(err);
        }
    }

    async function get_expenses() {
        try {            
            const data = await fetch(`${API_URL}/get_expenses.php`)
                .then(d => JSON.stringify(d));
            
            return data;
        } catch (err) {
            console.error(err);
        }
    }

    async function get_orders() {
        try {            
            const data = await fetch(`${API_URL}/get_orders.php`)
                .then(d => JSON.stringify(d));
            
            return data;
        } catch (err) {
            console.error(err);
        }
    }

    // POST
    async function add_stock(produto: string, quant: number) {
        const data_stock = {
            produto: produto,
            quant: quant,
        }

        try {
            const response = await fetch(`${API_URL}/add_stock.php`, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data_stock)
                }
            )

            if (!response.ok) {
                throw new Error("Erro na requisição!");
            }

            const result = await response.json();
            console.log(result);
        } catch (err) {
            console.error("Erro durante o POST: ", err);
        }
    }

    async function expenses() {
        const data = await fetch(`${API_URL}/expenses.php`)
            .then(d => JSON.stringify(d));
    }

    return {
        get_stock, get_orders, get_expenses, add_stock, expenses
    }
}

const API = api();

API.add_stock("teste", 2);

console.log(API.get_stock());