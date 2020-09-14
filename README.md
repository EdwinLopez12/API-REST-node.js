# Rest App [Node.js]!

Pequeña aplicación de los conocimientos sobre Node.js enfocados a una app de gestión de roles y permisos utilizando MongoDB.

# Herramienta

 - [x] Postman

# Librerias

 - [x] Express.js
 - [x] Nodemon
 - [x] Mongoose
 - [x] Json web token
 - [x] Dot environment
 - [x] Joi & Joi object id
 - [x] Cors
 - [x] Helmet

# Funcionalidades

Permite el CRUD de usuarios y el login, así como la validación de los permisos sobre las rutas y los roles que este posea, enfocados a un ambiente escolar (Instructores, cursos, estudiantes, administradores, entre otros). Incluye las rutas para el CRUD de roles.
En caso de que el usuario logueado no tenga los permisos sobre la vista, la app retornara un mensaje de **"Acceso denegado"**, al igual que sucederá en caso de no haberse logueado y obtenido el Json web token (este se enviará a través de los headers).
Todos estos procesos se hacen utilizando la herramientas **Postaman**.
