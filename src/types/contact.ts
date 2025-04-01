export interface Contact {
    id_contato?: number;
    ds_nome: string;
    ds_cargo: string;
    fl_ativo: boolean;
    tx_observacoes?: string;
    ds_email: string;
    ds_telefone: string;
    fl_whatsapp: boolean;
    clientId?: number;
}
