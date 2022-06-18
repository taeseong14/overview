const router = require('express').Router();
router.get('/wa', (req, res) => {
    res.send('dㅏㄴ');
});

router.use('/wordle', require('./wordle'));
router.use('/clicker', require('./clicker'));
router.use(require('./api'));

module.exports = router;