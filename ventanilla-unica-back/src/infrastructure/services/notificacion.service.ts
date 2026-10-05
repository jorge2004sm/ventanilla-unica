import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificacionService {
    private readonly logger = new Logger(NotificacionService.name);

    constructor(private readonly configService: ConfigService) {}

    async enviarConfirmacionCita(datos: {
        email: string;
        nombre: string;
        apellidos: string;
        fecha: Date;
        hora_inicio: string;
        hora_fin: string;
        tipo_tramite: string;
        requisitos_documentos: string;
        organizacion: string;
        empleado_email: string;
        direccion_tenant: string;
    }): Promise<void> {
        const webhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');

        if (!webhookUrl) {
            this.logger.warn('N8N_WEBHOOK_URL no configurada, no se envía email');
            return;
        }

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos),
            });
            this.logger.log(`Email de confirmación enviado a ${datos.email}`);
        } catch (error) {
            this.logger.error(`Error al enviar email a ${datos.email}`, error);
        }
    }
}
