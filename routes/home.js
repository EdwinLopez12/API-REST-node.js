'use strict';

const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    registerValidation,
    loginValidation
} = require('../validation/authValidation');

// Get basic routes

router.get('/', (req, res) => {
    res.render('index');
    // res.send('Index');
});

router.get('/register', (req, res) => {
    res.render('auth/register');
    // res.send('Register');
});

router.get('/login', (req, res) => {
    res.render('auth/login');
    // res.send('Login');
});

router.get('/buscar', async (req, res) => {
    const users = await User.find({});
    res.json(users);
    // res.send('buscar');
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
        _permisos: req.body._permisos
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

router.get('/buscar/:userId', async (req, res) => {
    try {
        const userFind = await User.find({ id: req.params.userId });
        res.send(userFind);
    } catch (err) {
        return res.status(400).send('Usuario no encontrado');
    }
});

router.delete('/eliminar/:userId', async (req, res) => {
    try {
        const removeUser = await User.remove({ id: req.params.userId });
        res.send(removeUser);
    } catch (err) {
        return res.status(400).send('Usuario no encontrado');
    }
});

router.patch('/actualizar/:userId', async (req, res) => {
    try {
        // Post.updateOne({ BUSQUEDA }, { parametros a actualizar });
        const updateUser = await User.updateOne(
            { id: req.params.userId },
            { $set: { name: req.body.name } }
        );
        res.send(updateUser);
    } catch (err) {
        return res.status(400).send('Usuario no encontrado');
    }
});


module.exports = router;