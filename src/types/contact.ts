export interface Client {
    id_cliente: number;
    fl_ativo: boolean;
    ds_nome: string;
    ds_razao_social: string;
    nr_cnpj: string;
    nr_inscricao_estadual: string;
    ds_site?: string | null;
    ds_endereco: string;
    ds_cep: string;
    ds_uf: string;
    ds_cidade: string;
    ds_bairro: string;
    nr_numero: string;
    ds_complemento?: string | null;
    nr_codigo_ibge?: number | null;
    nr_latitude?: number;
    nr_longitude?: number;
    nr_distancia_km?: number | null;
    tx_observacao_ident?: string | null;
    fl_matriz: boolean;
    ds_situacao: string;
    ds_sistema: string;
    ds_contrato: string;
    nr_nomeados: number;
    nr_simultaneos: number;
    nr_tecnica_remoto: number;
    nr_tecnica_presencial: number;
    tm_minimo_horas: string;
    ds_diario_viagem: string;
    ds_regiao: string;
    tx_observacao_contrato: string;
    nr_codigo_zz: number;
    nr_franquia_nf: number;
    nr_qtde_documentos: number;
    nr_valor_franqia: number;
    nr_valor_excendente: number;
    dt_data_contrato: string;
}

export interface Contact {
    id_contato: number;
    ds_nome: string;
    ds_cargo: string;
    fl_ativo: boolean;
    tx_observacoes?: string;
    ds_email: string;
    ds_telefone: string;
    fl_whatsapp: boolean;
    clientes?: Client[];
}
