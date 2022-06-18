const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

router.post('/', (req, res) => res.send('샌즈내오'));

router.post('/maker', (req, res) => {
    const { text } = req.query;
    if (!text) res.send('아무것도 없어요');
    res.send(text);
})

module.exports = router;