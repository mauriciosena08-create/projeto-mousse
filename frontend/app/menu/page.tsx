"use client";

import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Menu() {
    const router = useRouter();

    function backPage() {
        router.back();
    }

    return (
        <section className="bg-roxo py-20 px-10 rounded-2xl text-center flex flex-col items-center space-y-5">
            <TriangleAlert color="white" size={60} />
            <span className="font-semibold">Ainda estamos trabalhando nessa parte :(</span>
            <button onClick={backPage} className="underline cursor-pointer">Voltar</button>
        </section>
    )
}