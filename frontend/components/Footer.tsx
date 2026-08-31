import { ShoppingCart, Menu } from "lucide-react"
import User from "@/public/user.svg"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
    return (
        <footer className="bg-roxo flex items-center justify-around">
            <Link href={"/"}>
                <Menu color="white" size={30} />
            </Link>
            <Link href={"/"}>
                <ShoppingCart color="white" size={30} />
            </Link>
            <Link href={"/"}>
                <Image src={User} alt="" />
            </Link>
        </footer>
    )
}