const express = require("express");
const router = express.Router();

//routes
router.get("/", (req, res) => {
  res.send("welcome");
});

module.exports = router;
