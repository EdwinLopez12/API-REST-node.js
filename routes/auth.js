const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    registerValidation,
    loginValidation
} = require('../validation/authValidation');

// Rutas GET para el AUTH
router.get('/', (req, res) => {
    res.send('Registro/Inicio');
});

router.get('/register', (req, res) => {
    res.send('Registro/Registro');
});

router.get('/login', (req, res) => {
    res.send('Registro/Login');
});


// Rutas POST para el AUTH

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
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
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

module.exports = router;
