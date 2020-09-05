const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Importar las rutas
const authRoute = require("./routes/auth");
const postRoute = require('./routes/posts');

dotenv.config();

// Conectar a la base de datos
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Conectado a la base de datos")
);

// Middlewares
app.use(express.json()); //Formato de JSON a RESQUEST
// Middlewares de la ruta
app.use("/user", authRoute);
app.use('/posts', postRoute);

// Puerto de conexion
app.listen(3000, () => console.log("Corriendo"));
