const { Router } = require("express");

const router = new Router();

router.get("/", (req, res) => {
  res.json({"hello": "World"});
});

router.get("/:id", (req, res) => {
    res.json({"hello": "World"});
});

router.post("/", (req, res) => {
    res.json({"hello": "World"});
});

router.put("/", (req, res) => {
    res.json({"hello": "World"});
});

router.delete("/:id", (req, res) => {
    res.json({"hello": "World"});
});

module.exports = router;
