const router = require('express').Router();
const verify = require('./verifyToken');

router.all('*', verify);

// Rutas de pruebas
router.get('/', async (req, res) => {
    res.send('Rating - index');
});
router.get('/create', async (req, res) => {
    res.send('Rating - create');
});
router.get('/search', async (req, res) => {
    res.send('Rating - search');
});
router.get('/update', async (req, res) => {
    res.send('Rating - update');
});
router.get('/delete', async (req, res) => {
    res.send('Rating - delete');
});

module.exports = router;