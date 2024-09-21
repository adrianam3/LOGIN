-- Crear tabla persona
CREATE TABLE persona (
    idPersona INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(15),
    extension VARCHAR(15),
    celular VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL 
);

-- Crear tabla rol
CREATE TABLE rol (
    idRol INT AUTO_INCREMENT PRIMARY KEY,
    nombreRol VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    accesos TEXT,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL
	
	-- notas: ver opción de añadir un campo para tipo de usario (U usuario , A agente) dependiendo del tipo se enviaría a una interfaz u otra de agente o usuario 
	
);

-- Crear tabla areaUsuario
CREATE TABLE areaUsuario (
    idAreaU INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL
);

-- Crear tabla cargoUsuario
CREATE TABLE cargoUsuario (
    idCargoU INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL
);

-- Crear tabla usuario
CREATE TABLE usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
	descripcion TEXT NOT NULL,
    idPersona INTEGER NOT NULL,
    idAreaU INTEGER NOT NULL,
    idRol INTEGER NOT NULL,
	idCargoU INTEGER NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL,
    FOREIGN KEY (idPersona) REFERENCES persona(idPersona),
    FOREIGN KEY (idRol) REFERENCES rol(idRol),
    FOREIGN KEY (idAreaU) REFERENCES areaUsuario(idAreaU),
	FOREIGN KEY (idcargoU) REFERENCES cargoUsuario(idcargoU)
	
	--- posobilidad de crear el cargo del usuario 
	
	--ALTER TABLE `usuario`
  -- ADD CONSTRAINT `usuario_ibfk_4` FOREIGN KEY (`idcargoU`) REFERENCES `cargoUsuario` (`idcargoU`); -- 

);

-- Crear tabla departamentoAgente
CREATE TABLE departamentoAgente (
    idDepartamentoA INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    idUsuarioAdmin INTEGER NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL,
    FOREIGN KEY (idUsuarioAdmin) REFERENCES usuario(idUsuario)
);

-- Crear tabla nivelAgente
CREATE TABLE nivelAgente (
    idNivelAgente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL
);

-- Crear tabla agente
CREATE TABLE agente (
    idAgente INT AUTO_INCREMENT PRIMARY KEY,
    agente VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    idUsuario INTEGER NOT NULL,
    idNivelAgente INTEGER NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY (idNivelAgente) REFERENCES nivelAgente(idNivelAgente)
);

-- Crear tabla AgenteDepartamento
CREATE TABLE AgenteDepartamento (
    idAgente INTEGER NOT NULL,
    idDepartamentoA INTEGER NOT NULL,
	estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL,
    PRIMARY KEY (idAgente, idDepartamentoA),
    FOREIGN KEY (idAgente) REFERENCES agente(idAgente),
    FOREIGN KEY (idDepartamentoA) REFERENCES departamentoAgente(idDepartamentoA)
);

-- Crear tabla horario
CREATE TABLE horario (
    idHorario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    -- dia VARCHAR(20) NOT NULL, -- quitar
    -- horaInicio INT NOT NULL, -- quitar
    -- horaFin INT NOT NULL, -- quitar
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL
);

-- Crear tabla fuenteContacto
CREATE TABLE fuenteContacto (
    idfuenteContacto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL
);

-- Crear tabla temaAyuda
CREATE TABLE temaAyuda (
    idTemaAyuda INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    idTemaPadre INTEGER,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL,
    FOREIGN KEY (idTemaPadre) REFERENCES temaAyuda(idTemaAyuda)
);

-- Crear tabla estadoTicket
CREATE TABLE estadoTicket (
    idEstadoTicket INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL
);

-- Crear tabla prioridad
CREATE TABLE prioridad (
    idPrioridad INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL
);

-- Crear tabla sla
CREATE TABLE sla (
    idSla INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tiempoRespuesta INT NOT NULL,
    tiempoResolucion INT NOT NULL,
    idHorario INT NOT NULL,
    idPrioridad INT NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL,
    FOREIGN KEY (idHorario) REFERENCES horario(idHorario),
    FOREIGN KEY (idPrioridad) REFERENCES prioridad(idPrioridad)
);

-- Crear tabla ticket
CREATE TABLE ticket (
    idTicket INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(250) NOT NULL,
    descripcion TEXT NOT NULL,
    idSla INT NOT NULL,
    idPrioridad INT NOT NULL,
    idUsuario INT NOT NULL,
    idfuenteContacto INT NOT NULL,
    idTemaAyuda INT NOT NULL,
    resueltoPrimerContacto TINYINT(1) NOT NULL,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    idEstadoTicket INT NOT NULL,
    fechaInicioAtencion TIMESTAMP NULL,
    fechaPrimeraRespuesta TIMESTAMP NULL,
    fechaAtualizacion TIMESTAMP NULL,
    fechaReapertura TIMESTAMP NULL,
    fechaUltimaRespuesta TIMESTAMP NULL,
    fechaCierre TIMESTAMP NULL,
    FOREIGN KEY (idPrioridad) REFERENCES prioridad(idPrioridad),
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY (idSla) REFERENCES sla(idSla),
    FOREIGN KEY (idfuenteContacto) REFERENCES fuenteContacto(idfuenteContacto),
    FOREIGN KEY (idTemaAyuda) REFERENCES temaAyuda(idTemaAyuda),
    FOREIGN KEY (idEstadoTicket) REFERENCES estadoTicket(idEstadoTicket)
);

-- Crear tabla ticketDetalle
CREATE TABLE ticketDetalle (
    idTicketDetalle INT AUTO_INCREMENT PRIMARY KEY,
    idTicket INT NOT NULL,
    idAgente INT,
    idDepartamentoA INT NOT NULL,
    observacion VARCHAR(250) NOT NULL,
    detalle TEXT NOT NULL,
    fechaDetalle TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipoDetalle TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (idTicket) REFERENCES ticket(idTicket),
    FOREIGN KEY (idAgente) REFERENCES agente(idAgente),
    FOREIGN KEY (idDepartamentoA) REFERENCES departamentoAgente(idDepartamentoA)
);

-- Crear tabla encuesta
CREATE TABLE encuesta (
    idEncuesta INT AUTO_INCREMENT PRIMARY KEY,
    idTicket INT NOT NULL,
    idUsuario INT NOT NULL,
    puntuacion INT NOT NULL,
    comentarios TEXT,
    fechaEnvioEncuesta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaRespuestaEncuesta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idTicket) REFERENCES ticket(idTicket),
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);

-- Crear tabla CategoriasBaseConocimientos
CREATE TABLE CategoriasBaseConocimientos (
    idCategoria INT AUTO_INCREMENT PRIMARY KEY,
    nombreCategoria VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL
);

-- Crear tabla BaseConocimientos
CREATE TABLE BaseConocimientos (
    idArticulo INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    idCategoria INT,
    idAutor INT NOT NULL,
	publico TINYINT(1) NOT NULL DEFAULT 1, -- 1 publico, 0 privado
    estado TINYINT(1) NOT NULL DEFAULT 1,
    fechaCreacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fechaModificacion TIMESTAMP NULL,
    FOREIGN KEY (idCategoria) REFERENCES CategoriasBaseConocimientos(idCategoria),
    FOREIGN KEY (idAutor) REFERENCES usuario(idUsuario)
);


CREATE TABLE auditoria (
    idAuditoria INT AUTO_INCREMENT PRIMARY KEY,
    nombreTabla VARCHAR(100) NOT NULL,          -- Nombre de la tabla afectada
    tipoAccion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,  -- Tipo de acción realizada
    idRegistro INT NOT NULL,                    -- ID del registro afectado
    datosAnteriores TEXT,                       -- Datos antes del cambio (para UPDATE y DELETE)
    datosNuevos TEXT,                           -- Datos después del cambio (para INSERT y UPDATE)
    fechaAccion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Fecha y hora de la acción
    usuarioResponsable VARCHAR(50) NOT NULL,    -- Usuario que realizó la acción
    ipOrigen VARCHAR(45),                       -- IP del usuario que realizó la acción (opcional)
    detallesAdicionales TEXT                    -- Cualquier otro detalle adicional (opcional)
);
