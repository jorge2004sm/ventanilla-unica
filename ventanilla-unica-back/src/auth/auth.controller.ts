import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "src/domain/dto/login.dto";
import { RegistroDto } from "src/domain/dto/registro.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // Endpoint para login
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    // Endpoint para registro
    @Post('registro')
    async registro(@Body() dto: RegistroDto) {
        return this.authService.registro(dto);
    }
}