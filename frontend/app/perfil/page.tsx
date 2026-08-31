import Link from "next/link";
import { Pencil } from "lucide-react";
import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaShell, FigmaCard, figmaStyles } from "@/components/FigmaPage";

const pedidos = ["Mousse", "Bolo no pote"];

export default function Perfil() {
  return (
    <>
      <div className={`${figmaStyles.page} h-full mx-auto overflow-auto`}>
        <h1 className={figmaStyles.title}>Perfil</h1>
        <FigmaCard className="text-center">
          <FigmaUserIcon />
          <h2 className="font-bold text-lg mt-2">Fulano de Tal</h2>
          <p className="text-sm text-gray-500">Curso I Período</p>
          <Link href="/perfil/editar" className={`${figmaStyles.button} ${figmaStyles.purpleButton} flex items-center justify-center gap-2 mt-4`}>Editar perfil <Pencil size={16} /></Link>
        </FigmaCard>
        <FigmaCard className="mt-5">
          <h2 className="text-center font-bold text-lg mb-3">Meus pedidos</h2>
          <div className="space-y-3">
            {pedidos.map((pedido) => (
              <div className={figmaStyles.orderItem} key={pedido}>
                <strong>{pedido}</strong>
                <small>Clique para ver mais...</small>
                <span className={figmaStyles.orderDate}>00/00/03</span>
              </div>
            ))}
          </div>
        </FigmaCard>
        <button className={`${figmaStyles.button} mt-5`}>Desconectar</button>
      </div>
    </>
  );
}
