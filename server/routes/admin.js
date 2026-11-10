const express = require("express");
const router = express.Router();
const Post = require("../model/post");

/**
 * Get
 * Admi Login Page
 */
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: " Build a Blog with Node.js, Express & MongoDB ",
    };

    res.render("admin/index", { locals });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
