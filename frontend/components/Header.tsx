import { Menu } from "lucide-react";
import logo from "@/public/logo.png"
import Image from "next/image";

export default function Header() {
    return (
        <header className="bg-roxo flex items-center justify-between px-5">
            <Image loading="eager" src={logo} alt="Infodoces" />
            <Menu className="cursor-pointer" color="white" size={50} />
        </header>
    )
}