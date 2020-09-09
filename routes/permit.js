const router = require('express').Router();
const verify = require('./verifyToken');
const Permit = require('../model/Permit');
const {
    searchValidation,
    createValidation,
    updateValidation
} = require('../validation/permitValidation');

router.get('/', verify, (req, res) => {
    // res.send(req.user);
    res.send('Permisos-index');
});

router.get('/search', verify, async (req, res) => {
    const permits = await Permit.find();
    res.send(permits);
});

// Search, create, update, delete

router.get('/search/:permitId', verify, async (req, res) => {
    const { error } = searchValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const permitFind = await Permit.find({ id: req.body.permitId });
        res.send(permitFind);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.post('/create', verify, async (req, res) => {
    const { error } = createValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Crear el permiso
    const permit = new Permit({
        id: req.body.id,
        name: req.body.name,
        actions: req.body.actions,
        description: req.body.description
    });

    try {
        const savedPermit = await permit.save();
        res.send({ permit: permit._id });
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.patch('/update/:permitId', verify, async (req, res) => {
    const { error } = updateValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const updatePermit = await Permit.updateOne(
            { id: req.params.permitId },
            {
                $set:
                {
                    id: req.body.id,
                    name: req.body.name,
                    actions: req.body.actions,
                    description: req.body.description
                }
            }
        );
        res.send(updatePermit);
    } catch (error) {
        return res.status(400).send(err);
    }
});

module.exports = router;
