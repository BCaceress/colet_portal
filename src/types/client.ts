export interface ClientContact {
    id_contato: number;
    ds_nome: string;
    ds_cargo?: string;
    fl_ativo: boolean;
    tx_observacoes?: string;
    ds_email?: string;
    ds_telefone?: string;
    fl_whatsapp?: boolean;
    id_cliente: number;
}

export interface Client {
    id_cliente: number;
    fl_ativo: boolean;
    ds_nome: string;
    ds_razao_social?: string;
    nr_cnpj: string;
    nr_inscricao_estadual?: string;
    ds_site?: string;
    dt_data?: string;
    tx_observacoes?: string;
    ds_endereco?: string;
    ds_cep?: string;
    ds_uf?: string;
    ds_cidade?: string;
    ds_bairro?: string;
    nr_numero?: string;
    ds_complemento?: string;
    nr_codigo_ibge?: string;
    nr_latitude?: number;
    nr_longitude?: number;
    nr_distancia_km?: number;
    nr_hora_tecnica?: string;
    ds_situacao?: string;
    ds_sistema?: string;
    ds_contrato?: string;
    ds_observacao?: string;
    contatos?: ClientContact[];
}

