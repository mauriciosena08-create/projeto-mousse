"use client";

import { ShoppingCart, Home, User } from "lucide-react";
import Link from "next/link";
import { usePerfil } from "@/lib/atoms/perfilAtom";

export default function Header() {
    const { perfil } = usePerfil() as any;

    // Se o perfil for de admin, redireciona para /admin; se não, vai para /perfil
    const rotaPerfil = perfil?.tipo === "admin" ? "/admin" : "/perfil";

    return (
        <footer className="bg-roxo flex items-center justify-around py-5 border border-b-0 border-transparent">
            <Link href={"/"} className="bg-roxo-claro p-5 rounded-full">
                <Home color="white" size={30} />
            </Link>
            <Link href={"/carrinho"} className="bg-roxo-claro p-5 rounded-full">
                <ShoppingCart color="white" size={30} />
            </Link>
            <Link href={rotaPerfil} className="bg-roxo-claro p-5 rounded-full">
                <User color="white" size={30} />
            </Link>
        </footer>
    );
}
