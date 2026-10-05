import { DiaSemana } from "src/domain/enums/dia-semana.enum";
import { TipoHorario } from "src/domain/enums/tipo-horario.enum";
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { TenantOrmEntity } from "./tenant.orm-entity";

@Entity('horarios')
export class HorarioOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: TipoHorario,
    })
    tipo: TipoHorario;

    @Column({
        type: 'enum',
        enum: DiaSemana,
        nullable: true,
    })
    dia_semana: DiaSemana;

    @Column({ type: 'date', nullable: true })
    fecha_inicio: Date;

    @Column({ type: 'date', nullable: true })
    fecha_fin: Date;

    @Column({ type: 'time' })
    hora_inicio: string;

    @Column({ type: 'time' })
    hora_fin: string;

    @Column({ type: 'int', default: 30 })
    duracion_cita: number;

    @Column({ type: 'boolean', default: false })
    es_festivo: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    descripcion: string;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @ManyToOne(() => TenantOrmEntity, (tenant) => tenant.horarios)
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantOrmEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}