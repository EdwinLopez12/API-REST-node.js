const router = require('express').Router();
const verify = require('./verifyToken');

router.all('*', verify);

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