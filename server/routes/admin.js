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

router.post("/admin/register", async (req, res) => {
  try {
    const { username, password, email, setUpKey } = req.body;
    if (!username || !password || !email || !setUpKey) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (setUpKey !== process.env.ADMIN_SETUP_KEY) {
      res.status(403).json({
        message: "Its forbidden the setupkey you entered is not match",
      });
    }

    const existingAdmin = await Admin.countDocuments();

    if (existingAdmin > 0) {
      res.status(403).send("the admin already registered ");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: " Error in registering an admin",
    });
  }
});
module.exports = router;
