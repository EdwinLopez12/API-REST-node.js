'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Importar las rutas
const homeRoute = require('./routes/home');
// const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

// Conectar a la base de datos
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Conectado a la base de datos')
);

// Middlewares
app.use(express.json()); //Formato de JSON a RESQUEST
// Middlewares de la ruta
app.use('/', homeRoute);
// app.use('/user', authRoute);
app.use('/posts', postRoute);

// Configuracion de motor de plantillas a html
app.engine('html', require('./config/htmlEngine'));
app.set('views', path.join(__dirname, '/front-end/view'));
app.set('view engine', 'html');
// Declaración de public folder
app.use(express.static(__dirname + '/front-end/public'));


// Puerto de conexion
app.listen(3000, () => console.log('Corriendo'));
