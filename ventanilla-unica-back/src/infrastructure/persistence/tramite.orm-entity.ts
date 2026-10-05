import { EstadoTramite } from "src/domain/enums/estado-tramite.enum";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { CitaOrmEntity } from "./cita.orm-entity";
import { DocumentoOrmEntity } from "./documento.orm-entity";
import { TipoTramiteOrmEntity } from "./tipo-tramite.orm-entity";

@Entity('tramites')
export class TramiteOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: EstadoTramite,
        default: EstadoTramite.PENDIENTE,
    })
    estado: EstadoTramite;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @ManyToOne(() => TipoTramiteOrmEntity, (tipo) => tipo.tramites)
    @JoinColumn({ name: 'tipo_tramite_id' })
    tipoTramite: TipoTramiteOrmEntity;

    @OneToOne(() => CitaOrmEntity, (cita) => cita.tramite)
    @JoinColumn({ name: 'cita_id' })
    cita: CitaOrmEntity;

    @OneToMany(() => DocumentoOrmEntity, (doc) => doc.tramite)
    documentos: DocumentoOrmEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}