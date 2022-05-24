const express = require('express');
const router = express.Router();

router.post('/words', (req, res) => {
    res.sendFile(__dirname + '/words.json');
});

router.use(express.static(__dirname + '/web'));

router.get('/', (req, res) => {
    res.sendFile(__dirname + '/web/index.html');
});

module.exports = router;