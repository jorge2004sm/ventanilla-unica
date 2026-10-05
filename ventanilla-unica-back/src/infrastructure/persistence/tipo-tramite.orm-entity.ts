import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { TenantOrmEntity } from "./tenant.orm-entity";
import { TramiteOrmEntity } from "./tramite.orm-entity";

@Entity('tipos_tramite')
export class TipoTramiteOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    nombre: string;

    @Column({ type: 'text', nullable: true })
    descripcion: string;

    @Column({ type: 'text', nullable: true })
    requisitos_documentos: string;

    @ManyToOne(() => TenantOrmEntity, (tenant) => tenant.tiposTramite)
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantOrmEntity;

    @OneToMany(() => TramiteOrmEntity, (tramite) => tramite.tipoTramite)
    tramites: TramiteOrmEntity[];

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}