'use strict';

const router = require('express').Router();
const verfify = require('./verifyToken');
const Rol = require('../model/Role');
const {
    searchValidation,
    createValidation,
    updateValidation,
    deleteValidation
} = require('../validation/rolValidation');

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



// {
//     "id": 5,
//     "name": "Administrador",
//     "description": "administrador",
//     "permits": [
//         {
//             "name": "permisos",
//             "actions" : ["c", "r", "u", "d"]
//         }
//     ]
// }