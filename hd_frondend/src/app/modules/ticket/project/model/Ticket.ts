export class Ticket {
    idTicket: number;
    titulo: any;
    descripcion: string;
    idSla: number;
    idPrioridad: number;
    idUsuario: number;
    idfuenteContacto: number;
    idTemaAyuda: number;
    idEstadoTicket: number;
    resueltoPrimerContacto: string;
    fechaCreacion: Date;
    fechaModificacion: Date;
    fechaInicioAtencion: Date;
    fechaPrimeraRespuesta: Date;
    fechaAtualizacion: Date;
    fechaReapertura: Date;
    fechaUltimaRespuesta: Date;
    fechaCierre: Date;
}