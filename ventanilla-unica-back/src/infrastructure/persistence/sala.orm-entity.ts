import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MesaOrmEntity } from "./mesa.orm-entity";
import { TenantOrmEntity } from "./tenant.orm-entity";


@Entity('salas')
export class SalaOrmEntity{

    @PrimaryGeneratedColumn()   
    id: number;

    @Column({type: 'varchar', length: 100})
    nombre: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    descripcion: string;

    @Column({type: 'boolean', default: true})
    activa: boolean;

    @ManyToOne(() => TenantOrmEntity, (tenant) => tenant.salas)
    @JoinColumn({ name: 'tenant_id' })
    tenant: TenantOrmEntity;

    @OneToMany(() => MesaOrmEntity, (mesa) => mesa.sala)
    mesas: MesaOrmEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}