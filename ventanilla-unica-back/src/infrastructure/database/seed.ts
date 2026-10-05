import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { RolOrmEntity } from "../persistence/rol.orm-entity";
import { Repository } from "typeorm";
import { UsuarioOrmEntity } from "../persistence/usuario.orm-entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectRepository(RolOrmEntity) private readonly rolRepo: Repository<RolOrmEntity>,
        @InjectRepository(UsuarioOrmEntity) private readonly usuarioRepo: Repository<UsuarioOrmEntity>,
    ) { }

    async onModuleInit() {
        await this.seedRoles();
        await this.seedSuperAdmin();
    }

    private async seedRoles() {
        const roles = [
            { nombre: 'superadmin', descripcion: 'Administrador general del sistema' },
            { nombre: 'admin', descripcion: 'Administrador de un tenant' },
            { nombre: 'empleado', descripcion: 'Empleado que atiende citas' },
            { nombre: 'ciudadano', descripcion: 'Usuario que solicita citas' },
        ];

        for (const rol of roles) {
            const exists = await this.rolRepo.findOne({ where: { nombre: rol.nombre } });
            if (!exists) {
                await this.rolRepo.save(this.rolRepo.create(rol));
                this.logger.log(`Rol '${rol.nombre}' creado`);
            }
        }
    }

    private async seedSuperAdmin() {
        const email = 'superadmin@ventanillaunica.com';
        const exists = await this.usuarioRepo.findOne({ where: { email } });

        if (!exists) {
            const rolSuperAdmin = await this.rolRepo.findOne({ where: { nombre: 'superadmin' } });

            if (!rolSuperAdmin) {
                this.logger.error('Rol superadmin no encontrado, no se puede crear el usuario');
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('SuperAdmin123!', salt);

            const superadmin = this.usuarioRepo.create({
                nombre: 'Super',
                apellidos: 'Admin',
                email,
                password: hashedPassword,
                activo: true,
                rol: rolSuperAdmin as any,
            });

            await this.usuarioRepo.save(superadmin);
            this.logger.log('Usuario superadmin creado (superadmin@ventanillaunica.com / SuperAdmin123!)');
        }
    }
}