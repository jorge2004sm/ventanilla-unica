import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CitaOrmEntity } from "./cita.orm-entity";
import { MesaOrmEntity } from "./mesa.orm-entity";
import { RolOrmEntity } from "./rol.orm-entity";
import { TenantOrmEntity } from "./tenant.orm-entity";
import { VacacionOrmEntity } from "./vacacion.orm-entity";

@Entity('usuarios')
export class UsuarioOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({ type: 'varchar', length: 150 })
    apellidos: string;

    @Column({ type: 'varchar', length: 150, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, select: false })
    password: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    dni: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono: string;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @ManyToOne(() => RolOrmEntity, (rol) => rol.usuarios, { eager: true })
    @JoinColumn({ name: 'rol_id' })
    rol: RolOrmEntity;

    @ManyToOne(() => TenantOrmEntity, (tenant) => tenant.usuarios, { nullable: true })
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantOrmEntity;

    @ManyToOne(() => MesaOrmEntity, (mesa) => mesa.usuarios, { nullable: true })
    @JoinColumn({ name: 'mesa_id' })
    mesa: MesaOrmEntity;

    @OneToMany(() => CitaOrmEntity, (cita) => cita.empleado)
    citas: CitaOrmEntity[];

    @OneToMany(() => VacacionOrmEntity, (vacacion) => vacacion.usuario)
    vacaciones: VacacionOrmEntity[];

    @OneToMany(() => VacacionOrmEntity, (vacacion) => vacacion.aprobadoPor)
    vacacionesAprobadas: VacacionOrmEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}