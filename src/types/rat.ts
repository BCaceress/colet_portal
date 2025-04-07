export interface Rat {
    id_rat: number;
    ds_status: string;
    fl_deslocamento: string; 
    dt_data_hora_entrada: Date; 
    dt_data_hora_saida: Date; 
    tm_duracao: Date;
    tx_comentario_interno: string;
    ds_originada: string;
    ds_observacao: string;
    nr_km_ida?: number;
    nr_km_volta?: number;
    nr_valor_pedagio?: number;
    tx_atividades: string;
    tx_tarefas: string;
    tx_pendencias: string;

    id_usuario: number;
    id_cliente: number;
    id_contato: number;

    // Optional relations for frontend use
    usuario?: User;
    cliente?: Client;
    contato?: Contact;
}

// Add imports for related types
import { User } from './auth';
import { Client } from './client';
import { Contact } from './contact';

