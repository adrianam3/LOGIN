leame: 

0. URL Github: https://github.com/adrianam3/helpdesk-g11-pi.git
1. descaragar el archivo comprimido helpdesk-g11-pi.zip 
2. Para que se ejecute el backend se require tener instalado XAMPP
3. Descomprimr en la carpeta htdocs de xammp, la ruta por defecto es C:\xampp\htdocs
4. Se suguiere utilizar visual studio code para abri la carpeta principal del proyecto que es "helpdesk-g11-pi"
5. Para ejecutar el backend debe estar ejecutandose en xammp el servidor web Apache y MySQL
6. Crear la base de datos help_desk en MySQL, puede usar phpmyadmin
7. Importar la estructura de a base de datos con el script que se ecuentra en C:\xampp\htdocs\helpdesk-g11-pi\hd_backend\public\help_desk.sql
9. Modificar las credenciales de MySQL en C:\xampp\htdocs\helpdesk-g11-pi\hd_backend\config\config.php
	private $host = "localhost";
    private $usuario = "root";
    private $pass = "clave";
    private $base = "help_desk";
10. Para ejecutar el frontend, se debe ejecutar una terminal e ingresar a la ruta C:\xampp\htdocs\helpdesk-g11-pi\hd_frondend\
11. ejecutar el comando npm install, para que se descaren todas la dependecias configuradas en el proyecto
12. ejecutar el siguiente comando npm install ngx-quill@latest npm install quill@latest
13. ejecutar el comando npm star, para iniciar la aplicación 
14. Para ejecutar el chatbot con IA, se debe instalar pyton
15. para iniciar isntalar el chat bot se debe: 
	•	npm install -D vite  
	•	npm install
	•	pip install --upgrade chroma
	•	pip install openai
	•	pip install flask_cors
	•	python -m pip install flask
	•	npm init vite@latest
	•	pip list
16. Iniciar chatbot
	cd .\webapp\ 
	npm run dev
	cd .\backend\
	flask --app app run --debug

17. Usuarios aplicación Web Help Desk: 

	administrador: 
	email: adrian.merlo.am3+1@gmail.com
	clave: pass1234A.a

	coordinador:
	Usuario: adrian.merlo.am3+20@gmail.com
	Contraseña: pass1234A.a


	agente: 
	adrian.merlo.am3+21@gmail.com
	clave: pass1234A.a


	usuario: 
	adrian.merlo.am3+25@gmail.com
	clave: pass1234A.a


