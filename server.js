const express = require('express');
const router = require('./back');
const app = express();

app.use(express.static('front'));
app.use(router);

app.listen(3000, () => console.log('listening on port 3000'));
