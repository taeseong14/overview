const express = require('express');

const router = express.Router();

const user_data = [];

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.use(express.static(__dirname + "/src"));

router.get("/rank", (req, res) => res.send(user_data));

router.post("/click", (req, res) => {
    const body = req.body;
    let user = user_data.find(obj => obj.id === body.id);
    if (!user) {
        user_data.push({
            id: body.id,
            click: 0,
        });
        user = user_data.find(obj => obj.id === body.id);
    }
    user.click = body.click;
    res.send("댐");
});


module.exports = router;