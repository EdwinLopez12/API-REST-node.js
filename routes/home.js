const router = require('express').Router();

router.get('/', (req, res) => {
    // res.redirect('/posts');
    res.send('Index.html');
});

module.exports = router;