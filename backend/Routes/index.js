const express = require('express');
const router = express();

router.get("/", (req, res) => {
    res.send("Welcome to node-app");
});

router.use("/api/my-posts", require('./posts'));

module.exports = router