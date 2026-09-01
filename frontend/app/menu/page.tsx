import { TriangleAlert } from "lucide-react"
import Link from "next/link"

export default function Menu() {
    return (
        <section className="bg-roxo py-20 px-10 rounded-2xl text-center flex flex-col items-center space-y-5">
            <TriangleAlert color="white" size={60} />
            <span className="font-semibold">Ainda estamos trabalhando nessa parte: </span>
            <Link href="/" className="underline">Selecionar doces</Link>
        </section>
    )
}