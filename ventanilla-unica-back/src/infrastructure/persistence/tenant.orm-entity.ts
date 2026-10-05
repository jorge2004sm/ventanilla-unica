import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CitaOrmEntity } from "./cita.orm-entity";
import { HorarioOrmEntity } from "./horario.orm-entity";
import { SalaOrmEntity } from "./sala.orm-entity";
import { TipoTramiteOrmEntity } from "./tipo-tramite.orm-entity";
import { UsuarioOrmEntity } from "./usuario.orm-entity";

@Entity('tenants')
export class TenantOrmEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 150 })
    nombre: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    direccion: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 150, nullable: true })
    email: string;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @OneToMany(() => UsuarioOrmEntity, (usuario) => usuario.tenant)
    usuarios: UsuarioOrmEntity[];

    @OneToMany(() => SalaOrmEntity, (sala) => sala.tenant)
    salas: SalaOrmEntity[];

    @OneToMany(() => CitaOrmEntity, (cita) => cita.tenant)
    citas: CitaOrmEntity[];

    @OneToMany(() => HorarioOrmEntity, (horario) => horario.tenant)
    horarios: HorarioOrmEntity[];

    @OneToMany(() => TipoTramiteOrmEntity, (tipo) => tipo.tenant)
    tiposTramite: TipoTramiteOrmEntity[];


    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}