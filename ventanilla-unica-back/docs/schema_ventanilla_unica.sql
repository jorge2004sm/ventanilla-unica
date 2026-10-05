use ventanilla_unica;

-- Tabla Tenants
create table tenants(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(150),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla Roles
create table roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255)
);

-- Insert Roles 
insert into roles (nombre, descripcion) values 
('superadmin', 'Gestiona tenants y administradores'),
('admin', 'Administrador de un tenant'),
('empleado', 'Empleado que atiende citas'),
('ciudadano', 'Ciudadano que solicita citas');

-- Tabla Salas
CREATE TABLE salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    tenant_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Tabla Mesas
CREATE TABLE mesas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    sala_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sala_id) REFERENCES salas(id),
    UNIQUE KEY unique_mesa_sala (numero, sala_id)
);

-- Tabla Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dni VARCHAR(20),
    telefono VARCHAR(20),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    rol_id INT NOT NULL,
    mesa_id INT,
    tenant_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    foreign key (mesa_id) references mesas(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Tabla Citas
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
	
    -- Datos ciudadano (no login)
    ciudadano_nombre VARCHAR(100) NOT NULL,
    ciudadano_apellidos VARCHAR(150) NOT NULL,
    ciudadano_email VARCHAR(150) NOT NULL,
    ciudadano_dni VARCHAR(20) NOT NULL,
    ciudadano_telefono VARCHAR(20) NOT NULL,

    -- Datos cita
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado ENUM('pendiente', 'completada', 'no_presentado_ciudadano', 'no_presentado_empleado', 'cancelada') NOT NULL DEFAULT 'pendiente',
    observaciones TEXT,

	-- Relaciones
    empleado_id INT NOT NULL,
    ciudadano_id INT,
    tenant_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id),
    FOREIGN KEY (ciudadano_id) REFERENCES usuarios(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Tabla Vacaciones
CREATE TABLE vacaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    tipo ENUM('vacaciones', 'baja_medica', 'asuntos_propios') NOT NULL DEFAULT 'vacaciones',
    estado ENUM('pendiente', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    motivo VARCHAR(255),
    aprobado_por INT,
    usuario_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (aprobado_por) REFERENCES usuarios(id)
);

-- Tabla Horarios
CREATE TABLE horarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('base', 'especial') NOT NULL,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'),
    fecha_inicio DATE,
    fecha_fin DATE,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_cita INT NOT NULL DEFAULT 30,
    es_festivo BOOLEAN NOT NULL DEFAULT FALSE,
    descripcion VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    tenant_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Tabla Tipo_Tramites
CREATE TABLE tipos_tramite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    requisitos_documentos TEXT,
    tenant_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- Tabla Tramites
CREATE TABLE tramites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estado ENUM('pendiente', 'en_proceso', 'completado', 'rechazado') NOT NULL DEFAULT 'pendiente',
    observaciones TEXT,
    tipo_tramite_id INT NOT NULL,
    cita_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_tramite_id) REFERENCES tipos_tramite(id),
    FOREIGN KEY (cita_id) REFERENCES citas(id)
);


-- Tabla Documentos
CREATE TABLE documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tramite_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tramite_id) REFERENCES tramites(id)
);






