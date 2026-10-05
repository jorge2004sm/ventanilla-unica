import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UsuarioOrmEntity } from "./usuario.orm-entity";

@Entity('roles')
export class RolOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50, unique: true })
    nombre: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    descripcion: string;

    @Column({ type: 'boolean', default: true })
    activa: boolean;

    @OneToMany(() => UsuarioOrmEntity, (usuario) => usuario.rol)
    usuarios: UsuarioOrmEntity[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}