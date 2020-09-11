const router = require('express').Router();
const verify = require('./verifyToken');

router.all('*', verify);

// Rutas de pruebas
router.get('/', async (req, res) => {
    res.send('Learner - index');
});
router.get('/create', async (req, res) => {
    res.send('Learner - create');
});
router.get('/search', async (req, res) => {
    res.send('Learner - search');
});
router.get('/delete', async (req, res) => {
    res.send('Learner - delete');
});
router.get('/update', async (req, res) => {
    res.send('Learner - update');
});


module.exports = router;