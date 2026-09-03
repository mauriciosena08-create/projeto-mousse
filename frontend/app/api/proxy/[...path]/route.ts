import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://projeto-mousse.freehosting.dev/API";

async function handler(
    req: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;

    const url = `${API_URL}/${path.join("/")}`;

    try {
        const body =
            req.method === "GET" || req.method === "HEAD"
                ? undefined
                : await req.text();

        const response = await fetch(url, {
            method: req.method,
            headers: {
                "Content-Type":
                    req.headers.get("Content-Type") ||
                    "application/json",
            },
            body,
        });

        const data = await response.text();

        return new NextResponse(data, {
            status: response.status,
            headers: {
                "Content-Type":
                    response.headers.get("Content-Type") ||
                    "application/json",
            },
        });
    } catch (error) {
        console.error("Erro no proxy:", error);

        return NextResponse.json(
            {
                sucesso: false,
                mensagem: "Erro ao acessar a API.",
            },
            { status: 500 }
        );
    }
}

export {
    handler as GET,
    handler as POST,
    handler as PUT,
    handler as DELETE,
};