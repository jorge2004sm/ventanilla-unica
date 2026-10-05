import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RolesGuard } from "./roles.guard";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "./jwt.strategy";
import { RolOrmEntity } from "src/infrastructure/persistence/rol.orm-entity";
import { UsuarioOrmEntity } from "src/infrastructure/persistence/usuario.orm-entity";


@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        
        // Configura el modulo JWT leyendo el secret del .env
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET') || 'ventanilla_unica_secret',
                signOptions: { expiresIn: '24h' },
            }),
        }),
        TypeOrmModule.forFeature([UsuarioOrmEntity, RolOrmEntity]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RolesGuard],
    exports: [AuthService, JwtStrategy, RolesGuard],
})

export class AuthModule { }