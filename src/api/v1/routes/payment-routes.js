const { Router } = require("express");

const router = new Router();

router.get("/:bookid", (req, res) => {
    res.json({"hello": "World"});
});

router.post("/", (req, res) => {
    res.json({"hello": "World"});
});

module.exports = router;
