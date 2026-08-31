import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaShell, figmaStyles } from "@/components/FigmaPage";

const fields = ["Bolo de pote:", "Mousse de limão:", "Mousse de maracujá:", "Mousse de morango:"];

export default function Estoque() {
  return (
    <FigmaShell active="user">
      <div className={`${figmaStyles.adminContent} h-full mx-auto overflow-auto`}>
        <div className={figmaStyles.profileHead}><FigmaUserIcon /><span>Admin.</span></div>
        <h1 className="text-xl font-bold mb-8 ml-2">Editar estoque</h1>
        <div className={figmaStyles.stockGrid}>
          {fields.map((field) => <label key={field} className={figmaStyles.label}><span>{field}</span><input className={`${figmaStyles.input} mt-2`} /></label>)}
        </div>
        <button className={`${figmaStyles.button} mt-60`}>Salvar alterações</button>
      </div>
    </FigmaShell>
  );
}
