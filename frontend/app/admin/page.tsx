import Link from "next/link";
import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaShell, FigmaCard, figmaStyles } from "@/components/FigmaPage";

const pedidos = ["Mousse", "Bolo no pote", "Mousse", "Bolo no pote"];

export default function Admin() {
  return (
    <FigmaShell active="user">
      <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto`}>
        <div className={figmaStyles.profileHead}><FigmaUserIcon /><span>Admin.</span></div>
        <div className={figmaStyles.adminStats}>
          <div className={figmaStyles.adminStat}><label>N° de Pedidos:</label><input className={figmaStyles.input} value="X" readOnly /></div>
          <div className={figmaStyles.adminStat}><label>Estoque: <Link href="/admin/estoque" className="text-[var(--roxo-claro)]">✎</Link></label><input className={figmaStyles.input} value="X" readOnly /></div>
        </div>
        <FigmaCard>
          <h2 className="text-center font-bold text-lg mb-4">Pedidos</h2>
          <div className="space-y-2">
            {pedidos.map((pedido, i) => <Link href={`/admin/pedidos/${i + 1}`} className={`${figmaStyles.orderItem} block`} key={`${pedido}-${i}`}><strong>{pedido}</strong><small>Clique para ver mais...</small><span className={figmaStyles.orderDate}>00/00/03</span></Link>)}
          </div>
        </FigmaCard>
        <button className={`${figmaStyles.button} mt-5`}>Sair</button>
      </div>
    </FigmaShell>
  );
}
