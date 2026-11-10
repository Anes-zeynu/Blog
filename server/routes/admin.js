const express = require("express");
const router = express.Router();
const Admin = require("../model/Admin");
const Post = require("../model/post");

const bcryptjs = require("bcryptjs");
const adminLayout = "../views/layouts/admin";

/**
 * Get
 * Admin Registration Page
 */

router.get("/admin/register", async (req, res) => {
  try {
    const locals = {
      title: "Admin Registration Page",
      description: "Register Blog Administrator",
    };

    res.render("admin/register", {
      locals,
      adminLayout,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server error",
    });
  }
});
module.exports = router;
