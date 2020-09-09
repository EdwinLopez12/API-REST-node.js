'use strict';

const router = require('express').Router();
const verfify = require('./verifyToken');
const Rol = require('../model/Rol');
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
//     "id":1,
//     "name": "coordinador",
//     "description": "maxima autoridad",
//     "permits" : [
//         {
//             "_view" : "5f56d36170082823d8349325",
//             "actions" : ["c", "r", "u", "d"]
//         },
//         {
//             "_view" : "5f56d48d70082823d8349326",
//             "actions" : ["c", "r", "u", "d"]
//         }
//     ]
// }


// "id": 2,
//         "name": "coordinador",
//         "description": "maxima autoridad",
//         "permits": [
//             {
//                 "actions": [
//                     "c",
//                     "r",
//                     "u",
//                     "d"
//                 ],
//                 "_id": "5f5720014d30b90fcccee95b",
//                 "_view": "5f56d36170082823d8349325"
//             },
//             {
//                 "actions": [
//                     "c",
//                     "r",
//                     "u",
//                     "d"
//                 ],
//                 "_id": "5f5720014d30b90fcccee95c",
//                 "_view": "5f56d48d70082823d8349326"
//             }
//         ],
//         "__v": 0