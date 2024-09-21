<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER["REQUEST_METHOD"];
if ($method == "OPTIONS") {
    die();
}
//TODO: Controlador de ticket
require_once('revisarsesion.controller.php');
require_once('email.controller.php');
require_once('../models/persona.model.php');
require_once('../models/agente.model.php');
require_once('../models/ticket.model.php');
error_reporting(0); //DESHABILITAR ERROR, DEJAR COMENTADO si se desea que se muestre el error
$ticket = new Ticket;
$persona = new Persona;
$agente = new Agente;
switch ($_GET["op"]) {
    //TODO: Operaciones de ticket

    case 'todos': //TODO: Procedimiento para cargar todos los datos de ticket
        if (isset($_SESSION['idRol']) && isset($_SESSION['idUsuario'])) {
            $resultadoAgentes = $agente->agenteByUsuario($_SESSION['idUsuario']);
            $agenteData = mysqli_fetch_assoc($resultadoAgentes);
            $idAgente = $agenteData['idAgente'];
            $idRol = $_SESSION['idRol'];
            $idUsuario = $_SESSION['idUsuario'];
            $datos = array();
            $datos = $ticket->todos($idRol, $idUsuario, $idAgente);
            while ($row = mysqli_fetch_assoc($datos)) {
                $todos[] = $row;
            }
            echo json_encode($todos);
        } else {
            http_response_code(403);
            echo json_encode(array("message" => "Acceso denegado. No se encontró el rol del usuario."));
        }
        break;

    case 'dashboard': //TODO: Procedimiento para cargar todos los datos de ticketDetalle
        $fechaInicio = $_GET["fechaInicio"];
        $fechaFin = $_GET["fechaFin"];
        $fechaFinModificada = date('Y-m-d', strtotime($fechaFin . ' +1 day'));
        $fechaInicioModificada = date('Y-m-d', strtotime($fechaInicio . ' -1 day'));
        $todos = array();
        $datos = $ticket->dashboard($fechaInicioModificada, $fechaFinModificada);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;

    case 'dashboarddepartamentoestado': //TODO: Procedimiento para cargar todos los datos de ticketDetalle
        $fechaInicio = $_GET["fechaInicio"];
        $fechaFin = $_GET["fechaFin"];
        $fechaFinModificada = date('Y-m-d', strtotime($fechaFin . ' +1 day'));
        $fechaInicioModificada = date('Y-m-d', strtotime($fechaInicio . ' -1 day'));
        $todos = array();
            
        $datos = $ticket->dashboarddepartamentoestado($fechaInicioModificada, $fechaFinModificada);
        while ($row = mysqli_fetch_assoc($datos)) {
            $todos[] = $row;
        }
        echo json_encode($todos);
        break;
        

    case 'uno': //TODO: Procedimiento para obtener un registro de la base de datos
        $idTicket = $_POST["idTicket"];
        $datos = array();
        $datos = $ticket->uno($idTicket);
        $res = mysqli_fetch_assoc($datos);
        echo json_encode($res);
        break;

    case 'insertar': //TODO: Procedimiento para insertar un registro en la base de datos
        // Recibe los valores desde el POST
        $titulo = $_POST["titulo"];
        $descripcion = $_POST["descripcion"];
        $idSla = $_POST["idSla"];
        $idPrioridad = $_POST["idPrioridad"];
        $idUsuario = $_POST["idUsuario"];
        $idfuenteContacto = $_POST["idfuenteContacto"];
        $idTemaAyuda = $_POST["idTemaAyuda"];
        $resueltoPrimerContacto = $_POST["resueltoPrimerContacto"];
        $idEstadoTicket = $_POST["idEstadoTicket"];
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $idAgente = $_POST["idAgente"];
        $emailUsuario = $_POST["emailUsuario"];
        $nombreUsuario = $_POST["nombreUsuario"];

        // Preparar destinatarios
        $destinatarios = [
            ['email' => $emailUsuario, 'nombre' => $nombreUsuario]
        ];

        $resultadoPersonas = $persona->todosByRol('4'); // rol Coordinador id = 4
        if ($resultadoPersonas) {
            while ($row = mysqli_fetch_assoc($resultadoPersonas)) {
                $destinatarios[] = ['email' => $row['email'], 'nombre' => $row['nombreCompleto']];
            }
        }
        foreach ($destinatarios as $destinatario) {
            enviarEmailCrearTicket(
                emailRecibe: $destinatario['email'],
                nombreRecibe: $destinatario['nombre'],
                nombreCreadorTicket: $nombreUsuario,
                asunto: $titulo,
                detalle: $descripcion
            );
        }
        $datos = array();
        $datos = $ticket->insertar(
            $titulo,
            $descripcion,
            $idSla,
            $idPrioridad,
            $idUsuario,
            $idfuenteContacto,
            $idTemaAyuda,
            $resueltoPrimerContacto,
            $idEstadoTicket,
            $idDepartamentoA,
            $idAgente
        );

        echo json_encode($datos);
        break;


    case 'actualizar':
        $idTicket = $_POST["idTicket"];
        $titulo = $_POST["titulo"];
        $descripcion = $_POST["descripcion"];
        $idSla = $_POST["idSla"];
        $idPrioridad = $_POST["idPrioridad"];
        $idfuenteContacto = $_POST["idfuenteContacto"];
        $idTemaAyuda = $_POST["idTemaAyuda"];
        $resueltoPrimerContacto = $_POST["resueltoPrimerContacto"];
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $idAgente = $_POST["idAgente"];
        $idEstadoTicket = $_POST["idEstadoTicket"];
        $fechaInicioAtencion = $_POST["fechaInicioAtencion"] ? $_POST["fechaInicioAtencion"] : NULL;
        $fechaPrimeraRespuesta = $_POST["fechaPrimeraRespuesta"] ? $_POST["fechaPrimeraRespuesta"] : NULL;
        $fechaAtualizacion = $_POST["fechaAtualizacion"] ? $_POST["fechaAtualizacion"] : NULL;
        $fechaReapertura = $_POST["fechaReapertura"] ? $_POST["fechaReapertura"] : NULL;
        $fechaUltimaRespuesta = $_POST["fechaUltimaRespuesta"] ? $_POST["fechaUltimaRespuesta"] : NULL;
        $fechaCierre = $_POST["fechaCierre"] ? $_POST["fechaCierre"] : NULL;
        $nombreUsuario = $_POST["nombreUsuario"] ? $_POST["nombreUsuario"] : NULL;
        $resultado = $ticket->uno($idTicket);
        $ticketActual = $resultado->fetch_assoc();
        $resultadoAgente = $agente->uno($idAgente);

        if ($ticketActual['idAgente'] != $idAgente && $resultadoAgente) {
            $fila = $resultadoAgente->fetch_assoc();
            enviarEmailAgenteAsignado(
                idTicket: $idTicket,
                emailRecibe: $fila['agenteEmail'],
                nombreRecibe: $fila['agenteNombreCompleto'],
                nombrequienAsignaTicket: $nombreUsuario,
                asunto: $titulo
            );
        }

        // Actualizar el ticket con los nuevos valores
        $datos = $ticket->actualizar(
            $idTicket,
            $titulo,
            $descripcion,
            $idSla,
            $idPrioridad,
            $idfuenteContacto,
            $idTemaAyuda,
            $resueltoPrimerContacto,
            $idEstadoTicket,
            $idDepartamentoA,
            $idAgente,
            $fechaInicioAtencion,
            $fechaPrimeraRespuesta,
            $fechaAtualizacion,
            $fechaReapertura,
            $fechaUltimaRespuesta,
            $fechaCierre
        );
        echo json_encode($datos);
        break;

    case 'actualizaragente':
        $idTicket = $_POST["idTicket"];
        $titulo = $_POST["titulo"];
        $idDepartamentoA = $_POST["idDepartamentoA"];
        $idAgente = $_POST["idAgente"];
        $nombreUsuario = $_POST["nombreUsuario"] ? $_POST["nombreUsuario"] : NULL;
        $resultado = $ticket->uno($idTicket);
        $ticketActual = $resultado->fetch_assoc();
        $resultadoAgente = $agente->uno($idAgente);
        if ($ticketActual['idAgente'] != $idAgente && $resultadoAgente && $titulo) {
            $fila = $resultadoAgente->fetch_assoc();
            enviarEmailAgenteAsignado(
                idTicket: $idTicket,
                emailRecibe: $fila['agenteEmail'],
                nombreRecibe: $fila['agenteNombreCompleto'],
                nombrequienAsignaTicket: $nombreUsuario,
                asunto: $titulo
            );
        }

        // Actualizar el ticket con los nuevos valores
        $datos = $ticket->actualizarAgente(
            $idTicket,
            $idDepartamentoA,
            $idAgente
        );
        echo json_encode($datos);
        break;

    case 'eliminar': //TODO: Procedimiento para eliminar un registro en la base de datos
        $idTicket = $_POST["idTicket"];
        $datos = array();
        $datos = $ticket->eliminar($idTicket);
        echo json_encode($datos);
        break;
}
