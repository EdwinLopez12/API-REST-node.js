const router = require('express').Router();
const verify = require('./verifyToken');
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
            if (rolUser[i].permits[j].name == 'instructores') {
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
            if (users[0].specialPermits[i].name == 'instructores') {
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

// Rutas de pruebas
router.get('/', async (req, res) => {
    res.send('Instructor - index');
});
router.get('/create', async (req, res) => {
    res.send('Instructor - create');
});
router.get('/search', async (req, res) => {
    res.send('Instructor - search');
});
router.get('/delete', async (req, res) => {
    res.send('Instructor - delete');
});
router.get('/update', async (req, res) => {
    res.send('Instructor - update');
});

module.exports = router;