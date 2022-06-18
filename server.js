const express = require('express');
const router = require('./back');
const app = express();

app.use(express.static(__dirname + '/front'));
app.use(router);

app.get('/*', (req, res) => res.sendFile(__dirname + '/front/404.html'));

app.listen(3000, () => console.log('listening on port 3000'));
