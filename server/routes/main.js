const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  const layout = {
    title: "nodejs blog",
    description: " Build a Blog with Node.js, Express & MongoDB ",
  };
  res.render("index", { layout });
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
