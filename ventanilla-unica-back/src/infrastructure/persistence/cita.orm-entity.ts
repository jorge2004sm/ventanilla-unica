import { EstadoCita } from "src/domain/enums/estado-cita.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TenantOrmEntity } from "./tenant.orm-entity";
import { TramiteOrmEntity } from "./tramite.orm-entity";
import { UsuarioOrmEntity } from "./usuario.orm-entity";

@Entity('citas')
export class CitaOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    ciudadano_nombre: string;

    @Column({ type: 'varchar', length: 150 })
    ciudadano_apellidos: string;

    @Column({ type: 'varchar', length: 150 })
    ciudadano_email: string;

    @Column({ type: 'varchar', length: 20 })
    ciudadano_dni: string;

    @Column({ type: 'varchar', length: 20 })
    ciudadano_telefono: string;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ type: 'time' })
    hora_inicio: string;

    @Column({ type: 'time' })
    hora_fin: string;

    @Column({
        type: 'enum',
        enum: EstadoCita,
        default: EstadoCita.PENDIENTE,
    })
    estado: EstadoCita;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @ManyToOne(() => UsuarioOrmEntity, (usuario) => usuario.citas)
    @JoinColumn({ name: 'empleado_id' })
    empleado: UsuarioOrmEntity;

    @ManyToOne(() => UsuarioOrmEntity, { nullable: true })
    @JoinColumn({ name: 'ciudadano_id' })
    ciudadano: UsuarioOrmEntity;

    @ManyToOne(() => TenantOrmEntity, (tenant) => tenant.citas)
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantOrmEntity;

    @OneToOne(() => TramiteOrmEntity, (tramite) => tramite.cita)
    tramite: TramiteOrmEntity;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


}