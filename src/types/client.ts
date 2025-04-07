import { Contact } from './contact';

export interface ClientContact {
    id: number;
    id_cliente: number;
    id_contato: number;
    contato?: Contact;
}

export interface EmailCliente {
    id: number;
    ds_email: string;
    id_cliente: number;
}

export interface Client {
    id_cliente: number;
    fl_ativo: boolean;
    ds_nome: string;
    ds_razao_social: string;
    nr_cnpj: string;
    nr_inscricao_estadual: string;
    ds_site?: string;
    ds_endereco: string;
    ds_cep: string;
    ds_uf: string;
    ds_cidade: string;
    ds_bairro: string;
    nr_numero: string;
    ds_complemento?: string;
    nr_codigo_ibge?: string;
    nr_latitude?: number;
    nr_longitude?: number;
    nr_distancia_km?: number;
    tx_observacao_ident?: string;
    fl_matriz: boolean;
    ds_situacao: string;
    ds_sistema: string;
    ds_contrato: string;
    nr_nomeados: number;
    nr_simultaneos: number;
    nr_tecnica_remoto?: number;
    nr_tecnica_presencial?: number;
    tm_minimo_horas: Date; 
    ds_diario_viagem: string;
    ds_regiao: string;
    tx_observacao_contrato: string;
    nr_codigo_zz: number;
    nr_franquia_nf: number;
    nr_qtde_documentos: number;
    nr_valor_franqia: number;
    nr_valor_excendente: number;
    dt_data_contrato: Date; 
    clientesContatos?: ClientContact[];
    emails?: EmailCliente[];
}

