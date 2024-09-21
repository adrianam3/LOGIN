<?php
//TODO: Clase de Encuesta
require_once('../config/config.php');

class Encuesta
{
    //TODO: Implementar los métodos de la clase

    public function todos() // Select * from encuesta
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `encuesta`";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function uno($idEncuesta) // Select * from encuesta where id = $idEncuesta
    {
        $con = new ClaseConectar();
        $con = $con->ProcedimientoParaConectar();
        $cadena = "SELECT * FROM `encuesta` WHERE `idEncuesta`=$idEncuesta";
        $datos = mysqli_query($con, $cadena);
        $con->close();
        return $datos;
    }

    public function insertar($idTicket, $idUsuario, $puntuacion, $comentarios) // Insert into encuesta (...)
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "INSERT INTO `encuesta` (`idTicket`, `idUsuario`, `puntuacion`, `comentarios`) 
                       VALUES ('$idTicket', '$idUsuario', '$puntuacion', '$comentarios')";
            if (mysqli_query($con, $cadena)) {
                return $con->insert_id;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            http_response_code(500);
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }

    public function actualizar($idEncuesta, $idTicket, $idUsuario, $puntuacion, $comentarios, $fechaRespuestaEncuesta) // Update encuesta set ... where id = $idEncuesta
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "UPDATE `encuesta` SET 
                        `idTicket`='$idTicket', 
                        `idUsuario`='$idUsuario', 
                        `puntuacion`='$puntuacion', 
                        `comentarios`='$comentarios', 
                        `fechaRespuestaEncuesta`='$fechaRespuestaEncuesta'
                        WHERE `idEncuesta`=$idEncuesta";
            if (mysqli_query($con, $cadena)) {
                return $idEncuesta;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            http_response_code(500);
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }

    public function eliminar($idEncuesta) // Delete from encuesta where id = $idEncuesta
    {
        try {
            $con = new ClaseConectar();
            $con = $con->ProcedimientoParaConectar();
            $cadena = "DELETE FROM `encuesta` WHERE `idEncuesta`= $idEncuesta";
            if (mysqli_query($con, $cadena)) {
                return 1;
            } else {
                return $con->error;
            }
        } catch (Exception $th) {
            http_response_code(500);
            return $th->getMessage();
        } finally {
            $con->close();
        }
    }
}
