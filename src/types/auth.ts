export type UserRole = "ADMINISTRADOR" | "SUPORTE" | "DESENVOLVIMENTO" | "IMPLANTACAO" | "ANALISTA";

export interface User {
    id: string;
    name: string;  
    email: string;
    senha: string;
    role: UserRole;
}
