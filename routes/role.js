'use strict';

const router = require('express').Router();
const verify = require('./verifyToken');
const Rol = require('../model/Role');
const {
    searchValidation,
    createValidation,
    updateValidation,
    deleteValidation
} = require('../validation/rolValidation');
const User = require('../model/User');
const mongoose = require('mongoose');

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
            if (rolUser[i].permits[j].name == 'permisos') {
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
            if (users[0].specialPermits[i].name == 'permisos') {
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

router.get('/', (req, res) => {
    res.send('Rol - index');
});

router.get('/search', async (req, res) => {
    const roles = await Rol.find();
    res.send(roles);
});

// Search, create, update, delete

router.get('/search/:rolId', async (req, res) => {
    const { error } = searchValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const rolFind = await Rol.find({ id: req.params.rolId })
        res.send(rolFind);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.post('/create', async (req, res) => {
    const { error } = createValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rol = new Rol({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        permits: req.body.permits
    });

    try {
        const savedRol = await rol.save();
        res.send({ rol_id: rol.id, rol_name: rol.name });
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.patch('/update/:rolId', async (req, res) => {
    const { error } = updateValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const updateRol = await Rol.updateOne(
            { id: req.params.rolId },
            {
                $set:
                {
                    id: req.body.id,
                    name: req.body.name,
                    description: req.body.description,
                    permits: req.body.permits,
                    // updated_at = now
                }
            }
        );
        res.send(updateRol);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.delete('/delete/:rolId', async (req, res) => {
    const { error } = deleteValidation(req.data);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const removeRol = await Rol.remove({ id: req.params.rolId });
        res.send(removeRol);
    } catch (err) {
        return res.status(400).send(err);
    }
});


module.exports = router;