import { Pencil } from "lucide-react";
import FigmaUserIcon from "@/components/FigmaUserIcon";
import { FigmaShell, figmaStyles } from "@/components/FigmaPage";

const fields = [
  ["Nome:", "Fulano de Tal"],
  ["Curso:", "Curso"],
  ["Período:", "Período"],
  ["Senha:", "******"],
];

export default function EditarPerfil() {
  return (
    <FigmaShell active="user">
      <div className={`${figmaStyles.page} h-full mx-auto overflow-auto`}>
        <h1 className={figmaStyles.title}>Perfil</h1>
        <div className={`${figmaStyles.card} text-center mb-8`}>
          <FigmaUserIcon />
          <h2 className="font-bold text-lg mt-2">Fulano de Tal</h2>
          <p className="text-sm text-gray-500">Curso I Período</p>
        </div>
        <div className={figmaStyles.editGrid}>
          {fields.map(([label, value]) => (
            <label key={label} className={figmaStyles.label}>
              <span className="flex items-center gap-2">{label} <Pencil size={14} className="text-[var(--roxo-claro)]" /></span>
              <input className={`${figmaStyles.input} mt-2`} value={value} readOnly type={label === "Senha:" ? "password" : "text"} />
            </label>
          ))}
        </div>
        <button className={`${figmaStyles.button} mt-28`}>Salvar alterações</button>
      </div>
    </FigmaShell>
  );
}
