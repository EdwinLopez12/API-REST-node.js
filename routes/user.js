'use strict';

const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const verify = require('./verifyToken');
const mongoose = require('mongoose');
const {
    searchValidation,
    updateValidation,
    deleteValidation
} = require('../validation/userValidation');


router.all('*', verify, async (req, res, next) => {
    const userRefe = req.user._id;
    const users = await User.aggregate().lookup({
        from: "roles",
        localField: "_rol",
        foreignField: "_id",
        as: "rol_info"
    }).match({
        _id: new mongoose.Types.ObjectId(userRefe)
    });

    const rolUser = users[0].rol_info;
    const baseRoute = req.baseUrl;
    const actionRoute = req.path;
    let letter = actionRoute.charAt(1);
    let hasPermits = false; let hasAction = false;
    if (letter === 's') letter = 'r';

    console.log(baseRoute);
    console.log(actionRoute);

    for (var i = 0; i < rolUser.length; i++) {
        // console.log(rolUser[i]); //Devuelve rol + permisos
        for (var j = 0; j < rolUser[i].permits.length; j++) {
            // console.log(rolUser[i].permits[j].name);
            if (rolUser[i].permits[j].name == 'usuarios') {
                // console.log("Tiene el permiso: "+rolUser[i].permits[j].name);
                hasPermits = true;
            } else {
                continue;
            }
            for (var k = 0; k < rolUser[i].permits[j].actions.length; k++) {
                // console.log(rolUser[i].permits[j].actions[k]);
                if (rolUser[i].permits[j].actions[k] == letter) {
                    // console.log("Permite la accion: "+rolUser[i].permits[j].actions[k]);
                    hasAction = true;
                }
            }
        }
    }

    if (users[0].specialPermits.length > 0) {
        for (var i = 0; i < users[0].specialPermits.length; i++) {
            if (users[0].specialPermits[i].name == 'usuarios') {
                // console.log("Tiene el permiso: "+rolUser[i].permits[j].name);
                hasPermits = true;
            } else {
                continue;
            }
            for (var j = 0; j < users[0].specialPermits[i].actions.length; j++) {
                if (users[0].specialPermits[i].actions[j] == letter) {
                    // console.log("Permite la accion: "+rolUser[i].permits[j].actions[j]);
                    hasAction = true;
                }
            }
        }
    }

    if (hasPermits == true && hasAction == true) {
        next();
    } else {
        return res.status(401).send('Acceso denegado');
    }

});

router.get('/', async (req, res) => {
    res.send('Usuarios - index');
});

router.get('/search', async (req, res) => {
    const users = await User.aggregate([
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
});

// Rutas de pruebas
router.get('/create', async (req, res) => {
    res.send('Usuarios - create');
});

router.get('/search', async (req, res) => {
    res.send('Usuarios - search');
});

router.get('/delete', async (req, res) => {
    res.send('Usuarios - delete');
});

router.get('/update', async (req, res) => {
    res.send('Usuarios - update');
});

// Search, Update and delete users

router.get('/search/:userId', async (req, res) => {
    const { error } = searchValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const userFind = await User.find({ id: req.params.userId });
        res.send(userFind);
    } catch (err) {
        return res.status(400).send('Usuario no encontrado');
    }
});

router.delete('/delete/:userId', async (req, res) => {
    const { error } = deleteValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const removeUser = await User.remove({ id: req.params.userId });
        res.send(removeUser);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.patch('/update/:userId', async (req, res) => {
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