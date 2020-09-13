const { Router } = require("express");

const router = new Router();

/** 
 * Get all available taxi
 * source location
 * 
 * Returns: Array of cars
 */
router.get("/", (req, res) => {
    // Get user preference from req params
    // pnik cars!

    // get all taxi's based on given type

    // return

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
