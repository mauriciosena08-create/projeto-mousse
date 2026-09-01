const API_URL = "https://projeto-mousse.freehosting.dev/API";

export default function api() {
  // =========================
  // GET
  // =========================

  async function get_stock() {
    try {
      const response = await fetch(`${API_URL}/get_stock.php`);

      if (!response.ok) {
        throw new Error("Erro ao buscar estoque.");
      }

      return await response.json();
    } catch (err) {
      console.error("get_stock:", err);
      throw err;
    }
  }

  async function get_expenses() {
    try {
      const response = await fetch(`${API_URL}/get_expenses.php`);

      if (!response.ok) {
        throw new Error("Erro ao buscar despesas.");
      }

      return await response.json();
    } catch (err) {
      console.error("get_expenses:", err);
      throw err;
    }
  }

  async function get_orders() {
    try {
      const response = await fetch(`${API_URL}/get_orders.php`);

      if (!response.ok) {
        throw new Error("Erro ao buscar pedidos.");
      }

      return await response.json();
    } catch (err) {
      console.error("get_orders:", err);
      throw err;
    }
  }

  // =========================
  // POST
  // =========================

  async function add_stock(produto: string, quantidade: number) {
    const data = {
      produto,
      quantidade,
    };

    try {
      const response = await fetch(`${API_URL}/add_stock.php`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar estoque.");
      }

      return await response.json();
    } catch (err) {
      console.error("add_stock:", err);
      throw err;
    }
  }

  async function add_expense(
    item: string,
    quantidade: number,
    valor: number,
    data: string,
  ) {
    const expense = {
      item,
      quantidade,
      valor,
      data,
    };

    try {
      const response = await fetch(`${API_URL}/expenses.php`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar despesa.");
      }

      return await response.json();
    } catch (err) {
      console.error("add_expense:", err);
      throw err;
    }
  }

  async function login(nome: string, senha: string) {
    const data = {
      nome,
      senha,
    };

    try {
      const response = await fetch(`${API_URL}/login.php`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensagem || "Erro ao fazer login.");
      }

      return result;
    } catch (err) {
      console.error("login:", err);
      throw err;
    }
  }

  async function register(
    nome: string,
    senha: string,
    curso: string,
    periodo: string,
  ) {
    const data = {
      nome,
      senha,
      curso,
      periodo,
    };

    try {
      const response = await fetch(`${API_URL}/register.php`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensagem || "Erro ao registrar usuário.");
      }

      return result;
    } catch (err) {
      console.error("register:", err);
      throw err;
    }
  }

  async function add_order(
    usuario_id: number,
    itens: {
      produto_id: number;
      quantidade: number;
    }[],
  ) {
    const data = {
      usuario_id,
      itens,
    };

    try {
      const response = await fetch(`${API_URL}/add_order.php`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.mensagem || "Erro ao registrar pedido.");
      }

      return result;
    } catch (err) {
      console.error("add_order:", err);
      throw err;
    }
  }

  return {
    // GET
    get_stock,
    get_expenses,
    get_orders,

    // POST
    add_stock,
    add_expense,
    login,
    register,
    add_order,
  };
}
