import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TramiteOrmEntity } from "./tramite.orm-entity";

@Entity('documentos')
export class DocumentoOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    nombre_archivo: string;

    @Column({ type: 'varchar', length: 500 })
    ruta_archivo: string;

    @ManyToOne(() => TramiteOrmEntity, (tramite) => tramite.documentos)
    @JoinColumn({ name: 'tramite_id' })
    tramite: TramiteOrmEntity;

    @CreateDateColumn()
    created_at: Date;

}