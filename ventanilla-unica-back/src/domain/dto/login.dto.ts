import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto{
    @ApiProperty({description: 'Email del ciudadano', example: 'usuariociudadano@gmail.com', maxLength: 150})
    @IsEmail({}, {message: 'El email debe ser un email valido'})
    @MaxLength(150, {message: 'El email no puede tener mas de 150 caracteres'})
    email: string


    @ApiProperty({description: 'Contraseña del ciudadano', example: 'Passsword123!', minLength: 6})
    @IsString({message: 'La contraseña debe ser un string'})
    @MinLength(6, {message: 'La contraseña debe tener minimo 6 caracteres'})
    password: string
}