import { EstadoVacacion } from "src/domain/enums/estado-vacacion.enum";
import { TipoVacacion } from "src/domain/enums/tipo-vacacion.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UsuarioOrmEntity } from "./usuario.orm-entity";

@Entity('vacaciones')
export class VacacionOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    fecha_inicio: Date;

    @Column({ type: 'date' })
    fecha_fin: Date;

    @Column({ type: 'enum', enum: TipoVacacion, default: TipoVacacion.VACACIONES })
    tipo: TipoVacacion;

    @Column({
        type: 'enum',
        enum: EstadoVacacion,
        default: EstadoVacacion.PENDIENTE,
    })
    estado: EstadoVacacion;

    @Column({ type: 'varchar', length: 255, nullable: true })
    motivo: string;

    @ManyToOne(() => UsuarioOrmEntity, (usuario) => usuario.vacaciones)
    @JoinColumn({ name: 'usuario_id' })
    usuario: UsuarioOrmEntity;

    @ManyToOne(() => UsuarioOrmEntity, (usuario) => usuario.vacacionesAprobadas, { nullable: true })
    @JoinColumn({ name: 'aprobado_por' })
    aprobadoPor: UsuarioOrmEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}