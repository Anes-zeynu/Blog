const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  const locals = {
    title: "nodejs blog",
    description: " Build a Blog with Node.js, Express & MongoDB ",
  };
  res.render("index", { locals });
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});
module.exports = router;
