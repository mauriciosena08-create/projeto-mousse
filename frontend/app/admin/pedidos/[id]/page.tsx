import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaShell, FigmaCard, figmaStyles } from "@/components/FigmaPage";

export default async function PedidoDetalhe({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <FigmaShell active="user">
      <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto`}>
        <div className={figmaStyles.profileHead}><FigmaUserIcon /><span>Admin.</span></div>
        <FigmaCard>
          <div className={figmaStyles.ordersHeading}><Link href="/admin/pedidos"><ArrowLeft size={20} /></Link><span>Pedido #{id === "1" ? "000" : "000"}</span></div>
          <div className={figmaStyles.detail}>
            <p>Nome: fulano</p>
            <p>Curso: tal</p>
            <p>Período: x</p>
            <p className={figmaStyles.detailGap}>• &nbsp;Pedido:</p>
            <p>1 mousse de maracujá</p>
            <p>2 bolos de pote</p>
            <p className={figmaStyles.detailGap}>Data do pedido: 00/00/00</p>
            <p>Total: R$ x,xx</p>
          </div>
          <button className={`${figmaStyles.button} ${figmaStyles.purpleButton} ${figmaStyles.detailButton}`}>Finalizar pedido</button>
        </FigmaCard>
      </div>
    </FigmaShell>
  );
}
