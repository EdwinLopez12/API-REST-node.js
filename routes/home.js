'use strict';


const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verify = require('./verifyToken');
const mongoose = require('mongoose');
const {
    registerValidation,
    loginValidation,
    searchValidation,
    updateValidation,
    deleteValidation
} = require('../validation/authValidation');

// Get basic routes

router.get('/', (req, res) => {
    // res.render('index');
    res.send('pagina principal-index');
});

router.get('/register', (req, res) => {
    // res.render('auth/register');
    res.send('pagina principal -Register');
});

router.get('/login', (req, res) => {
    // res.render('auth/login');
    res.send('pagina principal - Login');
});

router.get('/search', verify, async (req, res) => {
    const userRefe = req.user._id;
    console.log(userRefe);
    const users = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(userRefe)
            }
        },
        {
            $lookup: {
                from: "roles",
                localField: "_rol",
                foreignField: "_id",
                as: "rol_info"
            }
        }
    ]);
    res.send(users);
    console.log(users);
});

// Login and Register

// Registro
router.post('/register', async (req, res) => {
    // Validar los datos antes de registrar
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Verificar la existencia de correo en la base de datos
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('El correo ya existe');

    // Hash al password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Crear usuario
    const user = new User({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        _rol: req.body._rol,
        specialPermits: req.body.specialPermits
    });

    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    // Validar los datos antes de registrar
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Verificar la existencia de correo en la base de datos
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send('El correo o contraseña son incorrectos');

    // Verificar que la contraseña sea correcta
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.status(400).send('El correo o la contraseña son incorrectos');

    // Crear y asingar el token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-toke', token).send(token);
});

// Search, Update and delete users

router.get('/search/:userId', verify, async (req, res) => {
    const { error } = searchValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const userFind = await User.find({ id: req.params.userId });
        res.send(userFind);
    } catch (err) {
        return res.status(400).send('Usuario no encontrado');
    }
});

router.delete('/delete/:userId', verify, async (req, res) => {
    const { error } = deleteValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const removeUser = await User.remove({ id: req.params.userId });
        res.send(removeUser);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.patch('/update/:userId', verify, async (req, res) => {
    const { error } = updateValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        // Post.updateOne({ BUSQUEDA }, { parametros a actualizar });
        // Hash al password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const updateUser = await User.updateOne(
            { id: req.params.userId },
            {
                $set:
                {
                    id: req.body.id,
                    name: req.body.name,
                    email: req.body.email,
                    // updated_at: now,
                    password: hashedPassword,
                    _rol: req.body._rol,
                    specialPermits: req.body.specialPermits
                }
            }
        );
        res.send(updateUser);
    } catch (err) {
        return res.status(400).send(err);
    }
});


module.exports = router;


// {
//     "id": 1,
//     "name": "coordinador",
//     "email": "coordinador@correo.com",
//     "password": "123456",
//     "_rol" : ["5f58ddeb3a95da0aa8529f4d"],
// }
    // 5f58e49e3a95da0aa8529f55
// {
//     "id": 2,
//     "name": "Carlos coordinador",
//     "email": "carloscoordinador@correo.com",
//     "password": "123456",
//     "_rol" : ["5f58ddeb3a95da0aa8529f4d"],
//     "specialPermits" : [
//         {
//             "name": "permisos",
//             "actions" : ["c", "r", "u", "d"]
//         }
//     ]
// }

// {
//     "id": 3,
//     "name": "Asistente coordinacion",
//     "email": "asistentecoordinador@correo.com",
//     "password": "123456",
//     "_rol" : ["5f58e3983a95da0aa8529f51"]
// }

// {
//     "id": 4,
//     "name": "Instructor",
//     "email": "instructor@correo.com",
//     "password": "123456",
//     "_rol" : ["5f58e4543a95da0aa8529f53"]
// }

// {
//     "id": 5,
//     "name": "Instructor Julio",
//     "email": "julioinstructor@correo.com",
//     "password": "123456",
//     "_rol" : ["5f58e4543a95da0aa8529f53"],
//     "specialPermits": [
//         {
//             "name": "aprendices",
//             "actions" : ["c", "r", "u", "d"]
//         },
//         {
//             "name": "cursos",
//             "actions" : ["c", "r", "u", "d"]
//         }
//     ]
// }

// {
//     "id": 6,
//     "name": "administrador",
//     "email": "administrador@correo.com",
//     "password": "123456",
//     "_rol" : ["5f58e4c23a95da0aa8529f57"]
// }


// {
//     "id": 7,
//     "name": "Estudiantes",
//     "email": "estudiante@correo.com",
//     "password": "123456",
//     "_rol" : ["5f58e49e3a95da0aa8529f55"]
// }