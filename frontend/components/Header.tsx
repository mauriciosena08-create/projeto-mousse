import logo from "@/public/logo.png"
import Image from "next/image";

export default function Header() {
    return (
        <header className="bg-roxo">
            <Image loading="eager" className="ml-5" src={logo} alt="Infodoces" />
        </header>
    )
}