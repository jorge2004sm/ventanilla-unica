import { Sala } from "./sala.model";

export interface Mesa {
    id: number;
    numero: number;
    activa: boolean;
    sala: Sala;
    created_at: string;
    updated_at: string;
}