import * as bcrypt from 'bcrypt';
import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RolOrmEntity } from 'src/infrastructure/persistence/rol.orm-entity';
import { UsuarioOrmEntity } from 'src/infrastructure/persistence/usuario.orm-entity';
import { Rol } from 'src/domain/enums/rol.enum';



@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UsuarioOrmEntity) private readonly usuarioRepo: Repository<UsuarioOrmEntity>,
        @InjectRepository(RolOrmEntity) private readonly rolRepo: Repository<RolOrmEntity>,
        private readonly jwtService: JwtService,
    ) { }

    async login(email: string, password: string){
        // Busca usuario por email y trae rol y tenant
        const usuario = await this.usuarioRepo.findOne({ where: { email }, select: ['id', 'nombre', 'apellidos', 'email', 'password', 'activo'], relations: ['rol', 'tenant'] });

        if(!usuario){
            throw new UnauthorizedException('Usuario no encontrado');
        }

        if(!usuario.activo){
            throw new UnauthorizedException('Usuario inactivo');
        }

        // Compara la contraseña en texto plano con el hash de la BD
        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Contraseña incorrecta');
        }

        // Crea el payload del JWT con los datos clave del usuario
        const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol.nombre, tenantId: usuario.tenant?.id || null };
        // Firma el payload con el secret --> genera el token string
        return {
            access_token: this.jwtService.sign(payload),
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                email: usuario.email,
                rol: usuario.rol.nombre,
                tenantId: usuario.tenant?.id || null,
                tenant_nombre: usuario.tenant?.nombre || null,
            }
        };

    }


    async registro(datos: { nombre: string, apellidos: string, email: string, password: string, dni?: string, telefono?: string }) {

        const rolCiudadano = await this.rolRepo.findOne({ where: { nombre: Rol.CIUDADANO } });

        if (!rolCiudadano) {
            throw new Error('Rol ciudadano no encontrado');
        }

        // Hashea la contraseña con bcrypt salt de 10 rondas
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(datos.password, salt);

        try{
            const usuario = this.usuarioRepo.create({
                ...datos,
                password: hashedPassword,
                rol: rolCiudadano,
            });

            const saved = await this.usuarioRepo.save(usuario);

            // Genera JWT
            const payload = { sub: saved.id, email: saved.email, rol: Rol.CIUDADANO, tenant: null };

            return {
                access_token: this.jwtService.sign(payload),
                usuario: {
                    id: saved.id,
                    nombre: saved.nombre,
                    apellidos: saved.apellidos,
                    email: saved.email,
                    rol: Rol.CIUDADANO,
                }
            };
        } catch (error: any) {
            // Si el email existe, MYSQL devuelve el error
            if(error.code === 'ER_DUP_ENTRY'){
                throw new ConflictException('Email ya registrado');
            }
            throw error;
        }
    }


    // Confirma que el usuario sigue existiendo y esta activo
    async validarUsuario(id: number) {
        return this.usuarioRepo.findOne({ where: { id }, relations: ['rol', 'tenant'] });
    }
}