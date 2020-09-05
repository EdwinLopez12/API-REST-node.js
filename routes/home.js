const router = require('express').Router();

router.get('/', (req, res) => {
    // res.redirect('/posts');
    res.render('index');
});

module.exports = router;