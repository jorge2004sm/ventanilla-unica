import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SalaOrmEntity } from "./sala.orm-entity";
import { UsuarioOrmEntity } from "./usuario.orm-entity";


@Entity('mesas')
export class MesaOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    numero: number;

    @Column({ type: 'boolean', default: true })
    activa: boolean;

    @ManyToOne(() => SalaOrmEntity, (sala) => sala.mesas)
    @JoinColumn({ name: 'sala_id' })
    sala: SalaOrmEntity;

    @OneToMany(() => UsuarioOrmEntity, (usuario) => usuario.mesa)
    usuarios: UsuarioOrmEntity[];


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}