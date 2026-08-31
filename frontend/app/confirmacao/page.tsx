import { Check, Pencil } from "lucide-react";
import { FigmaShell, figmaStyles } from "@/components/FigmaPage";

const items = [
  { name: "Bolo no pote de chocolate", qty: 1 },
  { name: "Mousse de maracujá", qty: 2 },
];

export default function Confirmacao() {
  return (
    <FigmaShell active="cart">
      <div className={`${figmaStyles.page} h-full mx-auto overflow-auto`}>
        <h1 className={figmaStyles.title}>Seu pedido é:</h1>
        {items.map((item) => (
          <div className={figmaStyles.confirmItem} key={item.name}>
            <div className={figmaStyles.placeholder} />
            <div className={figmaStyles.confirmCopy}>
              <strong>{item.name}</strong>
              <p>texto texto texto,<br />texto texto</p>
              <div className={figmaStyles.qty}><span>{item.qty}</span><Pencil /></div>
            </div>
          </div>
        ))}
        <div className={figmaStyles.confirmSpacer} />
        <button className={`${figmaStyles.button} flex items-center justify-center gap-3`}><span>Sim, está correto</span><Check /></button>
      </div>
    </FigmaShell>
  );
}
