import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TenantOrmEntity } from './infrastructure/persistence/tenant.orm-entity';
import { CitaOrmEntity } from './infrastructure/persistence/cita.orm-entity';
import { HorarioOrmEntity } from './infrastructure/persistence/horario.orm-entity';
import { MesaOrmEntity } from './infrastructure/persistence/mesa.orm-entity';
import { RolOrmEntity } from './infrastructure/persistence/rol.orm-entity';
import { SalaOrmEntity } from './infrastructure/persistence/sala.orm-entity';
import { UsuarioOrmEntity } from './infrastructure/persistence/usuario.orm-entity';
import { VacacionOrmEntity } from './infrastructure/persistence/vacacion.orm-entity';
import { DocumentoOrmEntity } from './infrastructure/persistence/documento.orm-entity';
import { TipoTramiteOrmEntity } from './infrastructure/persistence/tipo-tramite.orm-entity';
import { TramiteOrmEntity } from './infrastructure/persistence/tramite.orm-entity';
import { TipoTramiteController } from './infrastructure/controllers/tipo-tramite.controller';
import { CitaController } from './infrastructure/controllers/cita.controller';
import { HorarioController } from './infrastructure/controllers/horario.controller';
import { MesaController } from './infrastructure/controllers/mesa.controller';
import { SalaController } from './infrastructure/controllers/sala.controller';
import { TenantController } from './infrastructure/controllers/tenant.controller';
import { TramiteController } from './infrastructure/controllers/tramite.controller';
import { UsuarioController } from './infrastructure/controllers/usuario.controller';
import { VacacionController } from './infrastructure/controllers/vacacion.controller';
import { SalaTypeOrmRepository } from './infrastructure/persistence/repositories/sala.typeorm-repository';
import { CitaTypeOrmRepository } from './infrastructure/persistence/repositories/cita.typeorm-repository';
import { DocumentoTypeOrmRepository } from './infrastructure/persistence/repositories/documento.typeorm-repository';
import { HorarioTypeOrmRepository } from './infrastructure/persistence/repositories/horario.typeorm-repository';
import { MesaTypeOrmRepository } from './infrastructure/persistence/repositories/mesa.typeorm-repository';
import { RolTypeOrmRepository } from './infrastructure/persistence/repositories/rol.typeorm-repository';
import { TenantTypeOrmRepository } from './infrastructure/persistence/repositories/tenant.typeorm-repository';
import { TipoTramiteTypeOrmRepository } from './infrastructure/persistence/repositories/tipo-tramite.typeorm-repository';
import { TramiteTypeOrmRepository } from './infrastructure/persistence/repositories/tramite.typeorm-repository';
import { UsuarioTypeOrmRepository } from './infrastructure/persistence/repositories/usuario.typeorm-repository';
import { VacacionTypeOrmRepository } from './infrastructure/persistence/repositories/vacacion.typeorm-repository';
import { CrearCitaUseCase } from './application/use-cases/crear-cita.use-case';
import { GestionarCitaUseCase } from './application/use-cases/gestionar-cita.use-case';
import { GestionarHorarioUseCase } from './application/use-cases/gestionar-horario.use-case';
import { GestionarSalaMesaUseCase } from './application/use-cases/gestionar-sala-mesa.use-case';
import { GestionarTenantUseCase } from './application/use-cases/gestionar-tenant.use-case';
import { GestionarTipoTramiteUseCase } from './application/use-cases/gestionar-tipo-tramite.use-case';
import { GestionarTramiteUseCase } from './application/use-cases/gestionar-tramite.use-case';
import { GestionarUsuarioUseCase } from './application/use-cases/gestionar-usuario.use-case';
import { GestionarVacacionUseCase } from './application/use-cases/gestionar-vacacion.use-case';
import { SeedService } from './infrastructure/database/seed';
import { AuthModule } from './auth/auth.module';
import { NotificacionService } from './infrastructure/services/notificacion.service';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        TenantOrmEntity,
        UsuarioOrmEntity,
        RolOrmEntity,
        CitaOrmEntity,
        MesaOrmEntity,
        SalaOrmEntity,
        HorarioOrmEntity,
        VacacionOrmEntity,
        TramiteOrmEntity,
        DocumentoOrmEntity,
        TipoTramiteOrmEntity
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      TenantOrmEntity,
      UsuarioOrmEntity,
      RolOrmEntity,
      CitaOrmEntity,
      MesaOrmEntity,
      SalaOrmEntity,
      HorarioOrmEntity,
      VacacionOrmEntity,
      TramiteOrmEntity,
      DocumentoOrmEntity,
      TipoTramiteOrmEntity
    ]),
    AuthModule,
  ],
  controllers: [
    TenantController,
    UsuarioController,
    CitaController,
    MesaController,
    SalaController,
    HorarioController,
    VacacionController,
    TramiteController,
    TipoTramiteController

  ],
  providers: [
    { provide: 'ICitaRepository', useClass: CitaTypeOrmRepository },
    { provide: 'IUsuarioRepository', useClass: UsuarioTypeOrmRepository },
    { provide: 'ITenantRepository', useClass: TenantTypeOrmRepository },
    { provide: 'IRolRepository', useClass: RolTypeOrmRepository },
    { provide: 'ISalaRepository', useClass: SalaTypeOrmRepository },
    { provide: 'IMesaRepository', useClass: MesaTypeOrmRepository },
    { provide: 'IHorarioRepository', useClass: HorarioTypeOrmRepository },
    { provide: 'IVacacionRepository', useClass: VacacionTypeOrmRepository },
    { provide: 'ITramiteRepository', useClass: TramiteTypeOrmRepository },
    { provide: 'IDocumentoRepository', useClass: DocumentoTypeOrmRepository },
    { provide: 'ITipoTramiteRepository', useClass: TipoTramiteTypeOrmRepository },

    CrearCitaUseCase,
    GestionarCitaUseCase,
    GestionarTenantUseCase,
    GestionarUsuarioUseCase,
    GestionarVacacionUseCase,
    GestionarHorarioUseCase,
    GestionarSalaMesaUseCase,
    GestionarTramiteUseCase,
    GestionarTipoTramiteUseCase,
    SeedService,
    NotificacionService

  ],
})
export class AppModule { }
