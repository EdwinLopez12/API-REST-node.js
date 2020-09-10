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

router.all('*', verify);

router.get('/',  async (req, res) => {
    res.send('Usuarios - index');
});

router.get('/search', async (req, res) => {
    const userRefe = req.user._id;
    console.log(userRefe);
    const users = await User.aggregate([
        {
            $match: {
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