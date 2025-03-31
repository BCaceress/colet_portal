export type UserRole = "ADMINISTRADOR" | "SUPORTE" | "DESENVOLVIMENTO" | "IMPLANTACAO" | "ANALISTA";

export interface User {
    id: string;
    nome: string;
    email: string;
    senha: string;
    role: UserRole;
   // dataAdmissao: string;
    //ultimoAcesso: string | null;
}
