import { Menu } from "lucide-react";
import logo from "@/public/logo.png"
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-roxo flex items-center justify-between px-5">
            <Image loading="eager" src={logo} alt="Infodoces" />
            <Link className="cursor-pointer" href="/menu">
                <Menu  color="white" size={50} />
            </Link>
        </header>
    )
}