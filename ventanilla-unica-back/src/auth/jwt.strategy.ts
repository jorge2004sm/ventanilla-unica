import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            // Extrae el token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET') || 'ventanilla_unica_secret',
        });
    }

    
    async validate(payload: any) {
        const usuario = await this.authService.validarUsuario(payload.sub);

        if (!usuario) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        if (!usuario.activo) {
            throw new UnauthorizedException('Usuario desactivado');
        }

        return {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol.nombre,
            tenant: usuario.tenant?.id || null,
        };
    }
}