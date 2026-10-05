import { Sala } from "./sala.entity";

export class Mesa {
    id: number;
    numero: number;
    activa: boolean;
    sala: Sala;
    created_at: Date;
    updated_at: Date;
}