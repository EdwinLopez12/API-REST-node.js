'use strict';
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const app = express();

app.disable('x-powered-by');

// Importar las rutas
const homeRoute = require('./routes/home');
const permitRoute = require('./routes/permit');
const viewRoute = require('./routes/view');
const rolRoute = require('./routes/role');

dotenv.config();

// Conectar a la base de datos
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Conectado a la base de datos')
);

// A todo REQUEST se le da formato JSON, debde de ser especificado antes de las rutas
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

// Middlewares
app.use(express.json()); //Formato de JSON a RESQUEST

// Middlewares de la ruta
app.use('/', homeRoute);
app.use('/permit', permitRoute);
app.use('/view', viewRoute);
app.use('/rol', rolRoute);

// Configuracion de motor de plantillas a html
app.engine('html', require('./config/htmlEngine'));
app.set('views', path.join(__dirname, '/public/view'));
app.set('view engine', 'html');

// Declaración de public folder
app.use(express.static(__dirname + '/public'));


// Puerto de conexion
app.listen(3000, () => console.log('Corriendo'));
