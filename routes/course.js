const router = require('express').Router();
const verify = require('./verifyToken');

router.all('*', verify);

// Rutas de pruebas
router.get('/', async (req, res) => {
    res.send('Cursos - index');
});
router.get('/create', async (req, res) => {
    res.send('Cursos - create');
});
router.get('/search', async (req, res) => {
    res.send('Cursos - search');
});
router.get('/update', async (req, res) => {
    res.send('Cursos - update');
});
router.get('/delete', async (req, res) => {
    res.send('Cursos - delete');
});

module.exports = router;