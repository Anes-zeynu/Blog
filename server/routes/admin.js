const express = require("express");
const router = express.Router();
const Admin = require("../model/Admin");
const Post = require("../model/post");

const bcryptjs = require("bcryptjs");
const adminLayout = "../views/layouts/admin";
const authMiddleware = require("../middleware/authMiddleware");

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
      layout: adminLayout,
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

    res.redirect("/admin/login");
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
      layout: adminLayout,
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
      email,
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

    const isPasswordValid = await bcryptjs.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).render("admin/login", {
        error: "invalid email or password",
        layout: adminLayout,
        locals: {
          title: "Admin Login",
          description: "Login to Blog Admin Dashboard",
        },
      });
    }

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).send("session creation is failed");
      }

      req.session.admin = {
        id: admin._id.toString(),
        username: admin.username,
      };

      req.session.save((err) => {
        if (err) {
          return res.status(500).send("failed to save the session");
        }
        res.redirect("/dashboard");
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("failed to logged in");
  }
});

/**
 * Admin Dashboard
 */

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Admin Dashboard",
      description: "Blog Admin Dashboard",
    };

    const data = {
      totalPosts: await Post.countDocuments(),
      posts: await Post.find().sort({ createdAt: -1 }).limit(5),
    };

    res.render("admin/dashboard", {
      locals,
      data,
      admin: req.session.admin,
      layout: adminLayout,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Failed to load dashboard");
  }
});

/**
 * GET Posts
 */

/**
 * GET
 * All Posts Page
 */

router.get("/admin/posts", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "All Blog Posts",
      description: "Manage all your blog posts",
    };

    const posts = await Post.find().sort({ createdDate: -1 });
    res.render("admin/posts", {
      locals,
      posts,
      admin: req.session.admin,
      layout: adminLayout,
    });
  } catch (error) {
    console.error("All Posts Error:", error);
    res.status(500).send("Failed to load posts");
  }
});

router.post("/admin/posts/create", authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body || !title.trim() || !body.trim()) {
      res.status(400).send("title and body are required");
    }

    await Post.create({
      title: title.trim(),
      body: body.trim(),
      createdDate: new Date(),
    });
  } catch (error) {
    console.log("error in creating a new post", error);
    res.status(500).send("Error in creating a new post ", message);
  }
});
module.exports = router;
