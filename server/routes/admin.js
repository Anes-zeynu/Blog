const express = require("express");
const router = express.Router();
const Post = require("../model/post");

const adminLayout = "../views/layouts/admin";
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

    res.render("admin/index", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
