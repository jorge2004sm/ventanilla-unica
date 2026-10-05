import { BadRequestException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateCitaDto } from "src/domain/dto/create-cita.dto";
import { Cita } from "src/domain/entities/cita.entity";
import { EstadoTramite } from "src/domain/enums/estado-tramite.enum";
import { IHorarioRepository } from "src/domain/interfaces/i-horario.repository";
import { ICitaRepository } from "src/domain/interfaces/i-cita.repository";
import { ITipoTramiteRepository } from "src/domain/interfaces/i-tipo-tramite.repository";
import { ITramiteRepository } from "src/domain/interfaces/i-tramite.repository";
import { IUsuarioRepository } from "src/domain/interfaces/i-usuario.repository";
import { NotificacionService } from "src/infrastructure/services/notificacion.service";

@Injectable()
export class CrearCitaUseCase {
    constructor(@Inject('ICitaRepository') private readonly citaRepository: ICitaRepository,
        @Inject('IUsuarioRepository') private readonly usuarioRepository: IUsuarioRepository,
        @Inject('IHorarioRepository') private readonly horarioRepository: IHorarioRepository,
        @Inject('ITramiteRepository') private readonly tramiteRepository: ITramiteRepository,
        @Inject('ITipoTramiteRepository') private readonly tipoTramiteRepository: ITipoTramiteRepository,
        private readonly notificacionService: NotificacionService) { }

    async execute(dto: CreateCitaDto): Promise<Cita> {
        const hoy = new Date();
        const fechaCita = new Date(dto.fecha);

        const diffDias = Math.ceil((fechaCita.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDias < 0) {
            throw new BadRequestException('No se puede elegir fechas pasadas');
        }


        if (diffDias > 7) {
            throw new BadRequestException('No se pueden elegir fechas con más de 7 días de anticipación');
        }

        const tipoTramite = await this.tipoTramiteRepository.findById(dto.tipo_tramite_id);

        if (!tipoTramite) {
            throw new BadRequestException('Tipo de trámite no encontrado');
        }

        const horarioEspecial = await this.horarioRepository.findByFecha(fechaCita, dto.tipo_tramite_id);

        if (horarioEspecial && horarioEspecial.es_festivo) {
            throw new BadRequestException('No se puede pedir cita en dias festivos');
        }


        const diaSemana = fechaCita.toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); 
        const horarioBase = await this.horarioRepository.findBaseByTenant(dto.tenant_id);
        const horarioDia = horarioBase.find(h => h.dia_semana === diaSemana);

        if (!horarioDia) {
            throw new BadRequestException('No se puede pedir cita en este día de la semana');
        }

        const horarioActivo = (horarioEspecial && horarioEspecial.es_festivo) ? horarioEspecial : horarioDia;

        if (dto.hora_inicio < horarioActivo.hora_inicio || dto.hora_fin > horarioActivo.hora_fin) {
            throw new BadRequestException('La hora de la cita esta fuera del horario de atención');

        }


        const empleadosDisponibles = await this.usuarioRepository.findDisponibles(dto.tenant_id);

        if (empleadosDisponibles.length === 0) {
            throw new BadRequestException('No hay empleados disponibles para atender la cita');
        }

        const citasDelDia = await this.citaRepository.findByFecha(dto.fecha, dto.tenant_id);

        const empleadosOcupados = citasDelDia.filter(c => c.hora_inicio.slice(0, 5) === dto.hora_inicio.slice(0, 5)).map(c => c.empleado.id);


        const empleadoLibre = empleadosDisponibles.find(e => !empleadosOcupados.includes(e.id));

        if (!empleadoLibre) {
            throw new BadRequestException('No hay huecos disponibles para la hora seleccionada');
        }

        const cita = await this.citaRepository.create({
            ciudadano_nombre: dto.ciudadano_nombre,
            ciudadano_apellidos: dto.ciudadano_apellidos,
            ciudadano_email: dto.ciudadano_email,
            ciudadano_dni: dto.ciudadano_dni,
            ciudadano_telefono: dto.ciudadano_telefono,
            fecha: fechaCita,
            hora_inicio: dto.hora_inicio,
            hora_fin: dto.hora_fin,
            empleado: empleadoLibre as any,
            tenant: { id: dto.tenant_id } as any,
            ciudadano: dto.ciudadano_id ? ({ id: dto.ciudadano_id } as any) : null,
        });


        try {
            await this.tramiteRepository.create({
                tipoTramite: tipoTramite as any,
                cita: cita as any,
                estado: EstadoTramite.PENDIENTE,
            });
        } catch (error) {
            throw new InternalServerErrorException('Error al crear la cita');
        }

        // Enviar email (no bloquea si falla)
        await this.notificacionService.enviarConfirmacionCita({
            email: cita.ciudadano_email,
            nombre: cita.ciudadano_nombre,
            apellidos: cita.ciudadano_apellidos,
            fecha: cita.fecha,
            hora_inicio: cita.hora_inicio,
            hora_fin: cita.hora_fin,
            tipo_tramite: tipoTramite.nombre,
            requisitos_documentos: tipoTramite.requisitos_documentos,
            organizacion: tipoTramite.tenant.nombre,
            empleado_email: cita.empleado.email,
            direccion_tenant: tipoTramite.tenant.direccion
        });

        return cita;


    }

    async obtenerHorasOcupadas(tenantId: number, fecha: string): Promise<string[]> {
        const empleadosDisponibles = await this.usuarioRepository.findDisponibles(tenantId);
        const totalEmpleados = empleadosDisponibles.length;
        const citasDelDia = await this.citaRepository.findByFecha(fecha, tenantId);

        const contadorPorHora = new Map<string, number>();
        citasDelDia.forEach(c => {
            const hora = c.hora_inicio.slice(0, 5);
            contadorPorHora.set(hora, (contadorPorHora.get(hora) || 0) + 1);
        });

        const horasLlenas: string[] = [];
        contadorPorHora.forEach((count, hora) => {
            if (count >= totalEmpleados) {
                horasLlenas.push(hora);
            }
        });

        return horasLlenas;
    }

}
