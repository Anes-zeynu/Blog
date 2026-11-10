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
    return res.status(500).json({
      message: "server error",
    });
  }
});

router.post("/admin/register", async (req, res) => {
  try {
    const { username, password, email, setupKey } = req.body;
    if (!username || !password || !email || !setupKey) {
      return res.status(400).send("all fields required");
    }

    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({
        message: "Its forbidden the setupkey you entered is not match",
      });
    }

    const existingAdmin = await Admin.countDocuments();

    if (existingAdmin > 0) {
      return res.status(403).send("the admin already registered ");
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    await Admin.create({
      username,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send("Email already existed");
    }
    console.log(error);
    return res.status(500).json({
      message: " Error in registering an admin",
    });
  }
});

/**
 * GET
 * Admin Login Page
 */

router.get("/admin/login", async (req, res) => {
  try {
    const locals = {
      title: "Admin Login page",
      description: "Login to Blog Admin Dashboard",
    };
    res.render("admin/login", {
      locals,
      adminLayout,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "server error",
    });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("admin/login", {
        error: "email and passwords are required",
        layout: adminLayout,
        locals: {
          title: "Admin Login",
          description: "Login to Blog Admin Dashboard",
        },
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!admin) {
      return res.status(401).render("admin/login", {
        error: "Invalid email or password",
        layout: adminLayout,
        locals: {
          title: "Admin Login",
          description: "Login to Blog Admin Dashboard",
        },
      });
    }
    bcryptjs.compare(password, admin.password);
  } catch (error) {
    console.log(error);
    return res.status(500).send("failed to logged in");
  }

  bcryptjs.compare(password, admin.password);
});
module.exports = router;
