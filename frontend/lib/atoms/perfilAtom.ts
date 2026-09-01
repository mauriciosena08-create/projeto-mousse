import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

type PerfilProps = {
    nome: string;
    curso: string;
    periodo: string;
    senha: string;
};

export const perfilAtom = atomWithStorage<PerfilProps | undefined>(
    "perfil",
    undefined,
    undefined,
    {
        getOnInit: true,
    }
);

export function usePerfil() {
    const [perfil, setPerfil] = useAtom(perfilAtom);

    const obterPerfil = () => perfil;

    const definirPerfil = (perfil: PerfilProps) => {
        setPerfil(perfil);
    };

    const limparPerfil = () => {
        setPerfil(undefined);
    };

    return {
        perfil,
        obterPerfil,
        definirPerfil,
        limparPerfil,
    };
}