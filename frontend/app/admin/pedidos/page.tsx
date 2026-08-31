import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaShell, figmaStyles } from "@/components/FigmaPage";

const orders = [1, 2, 3, 4, 5];

export default function PedidosAdmin() {
  return (
    <FigmaShell active="user">
      <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto`}>
        <div className={figmaStyles.profileHead}><FigmaUserIcon /><span>Admin.</span></div>
        <section className={figmaStyles.ordersBox}>
          <div className={figmaStyles.ordersHeading}><Link href="/admin"><ArrowLeft size={20} /></Link><span>Pedidos (8 pendentes)</span></div>
          <div className={figmaStyles.ordersList}>
            {orders.map((id) => <Link href={`/admin/pedidos/${id}`} className={figmaStyles.adminOrder} key={id}><strong>Pedido #0000</strong><strong>Nome: fulano</strong><span>Clique para ver mais...</span></Link>)}
          </div>
        </section>
      </div>
    </FigmaShell>
  );
}
