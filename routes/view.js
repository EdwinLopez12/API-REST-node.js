const router = require('express').Router();
const verify = require('./verifyToken');
const View = require('../model/View');
const { 
    searchValidation,
    createValidation,
    updateValidation,
    deleteValidation
} = require('../validation/viewValidation');

router.get('/', (req, res) => {
    res.send('Vistas-index');
});

router.get('/create', (req, res) => {
    res.send('Vistas-crear');
});

router.get('/search', async (req, res) => {
    const views = await View.find();
    res.send(views);
});

// Search, create, update, delete

router.get('/search/:viewId', async (req, res) => {
    const { error } = searchValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        const viewFind = await View.find({ id: req.body.id });
        res.send(viewFind);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.post('/create', async (req, res) => {
    const { error } = createValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const view = new View({
        id: req.body.id,
        name: req.body.name,
        description: req.body.description
    });

    try {
        const savedView = await view.save();
        res.send({ view_id: view._id, view_name: view.name });
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.patch('/update/:viewId', async (req, res) => {
    const { error } = updateValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        const updateView = await View.updateOne(
            { id: req.params.viewId },
            {
                $set:
                {
                    id: req.body.id,
                    name: req.body.name,
                    description: req.body.description
                }
            }
        );
        res.send(updateView);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.delete('/delete/:viewId', async (req, res) => {
    const { error } = deleteValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        const removeView = await View.remove({ id: req.params.viewId });
        res.send(removeView);
    } catch (err) {
        return res.status(400).send(err)
    }
});

module.exports = router;