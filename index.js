'use strict';
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const app = express();

// Importar las rutas
const homeRoute = require('./routes/home');
const userRoute = require('./routes/user');
const roleRoute = require('./routes/role');

// Variables en el archivo .env
dotenv.config();

// Conectar a la base de datos
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Conectado a la base de datos')
);

// Uso de Helmet
app.use(helmet());

// A todo REQUEST se le da formato JSON, debde de ser especificado antes de las rutas
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

// Middlewares
app.use(express.json()); //Formato de JSON a RESQUEST

// Middlewares de la ruta
app.use('/', homeRoute);
app.use('/user', userRoute);
app.use('/role', roleRoute);

// Configuracion de motor de plantillas a html
app.engine('html', require('./config/htmlEngine'));
app.set('views', path.join(__dirname, '/public/view'));
app.set('view engine', 'html');

// Declaración de public folder
app.use(express.static(__dirname + '/public'));


// Puerto de conexion
app.listen(3000, () => console.log('Corriendo'));
