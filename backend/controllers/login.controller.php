<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Origin, Content-Type, Access-Control-Allow-Headers, Accept, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}
include_once '../models/usuario.model.php';
$email = isset($_POST["email"]) ? $_POST["email"] : '';
$password = isset($_POST["password"]) ? $_POST["password"] : '';
if (!empty($email) && !empty($password)) {
    $usuarioModelo = new Usuario();

    // Autenticar al usuario
    $user_data = $usuarioModelo->login($email, $password);
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    if ($user_data) {
        $_SESSION['loggedin'] = true;
        $_SESSION['email'] = $email;
        $_SESSION['usuarioId'] = $user_data['idUsuario'];
        $_SESSION['idRol'] = $user_data['idRol'];
        $_SESSION['idUsuario'] = $user_data['idUsuario'];
        setcookie(session_name(), session_id(), [
            'expires' => time() + 86400,
            'path' => '/',
            'domain' => 'localhost',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);

        http_response_code(200);
        echo json_encode(array("message" => "Login exitoso.", "user" => $user_data));
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Login fallido."));
    }
} elseif (isset($_GET['action']) && $_GET['action'] == 'logout') {
    $_SESSION = array();

    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }
    session_destroy();
    http_response_code(200);
    echo json_encode(array("message" => "Logout exitoso."));
    exit;
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Datos incompletos."));    
}
