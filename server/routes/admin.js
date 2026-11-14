const express = require("express");
const router = express.Router();
const Admin = require("../model/Admin");
const Post = require("../model/post");

const bcryptjs = require("bcryptjs");
const adminLayout = "../views/layouts/admin";
const authMiddleware = require("../middleware/authMiddleware");
const cookie = require("express-session/session/cookie");

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
    return res.status(500).send("Failed to load dashboard");
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
    return res.status(500).send("Failed to load posts");
  }
});

/**
 * GET
 * create a new post page
 */

router.get("/admin/posts/new", authMiddleware, (req, res) => {
  res.render("admin/create-post", {
    locals: {
      title: "Create New Post",
      description: "Create a new blog post",
    },
    admin: req.session.admin,
    layout: adminLayout,
  });
});
/**
 * create a new post
 */
router.post("/admin/posts/create", authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body || !title.trim() || !body.trim()) {
      return res.status(400).send("title and body are required");
    }

    await Post.create({
      title: title.trim(),
      body: body.trim(),
      createdDate: new Date(),
    });
    res.redirect("/admin/posts");
  } catch (error) {
    console.log("error in creating a new post", error);
    return res.status(500).send("Error in creating a new post ", message);
  }
});

/**
 * Delete the published posts
 */
router.delete("/admin/posts/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;

    await Post.findByIdAndDelete(postId);
    res.redirect("/admin/posts");
  } catch (error) {
    console.log("errot in deleting", error);
    return res.status(500).send("failed to  deleting posts");
  }
});

/**
 * Edit the posts
 */

router.get("/admin/posts/edit/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.render("admin/edit", { post });
  } catch (error) {
    console.log("Error finding post:", error);
    return res.status(500).send("Failed to load edit page");
  }
});

router.put("/admin/posts/:id", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, body } = req.body;
    await Post.findByIdAndUpdate(
      postId,
      {
        title,
        body,
        updatedDate: Date.now(),
      },
      {
        runValidators: true,
      },
    );
    res.redirect("/admin/posts");
  } catch (error) {
    console.log("error in updating posts", error);
    return res.status(500).send("failed to update a post");
  }
});

/**
 * post
 * Admin logout
 */
router.post("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("logout error", err);
      return res.status(500).send("failed to logout");
    }

    res.clearCookie("connect.sid", {
      path: "/",
    });

    res.redirect("/admin/login");
  });
});
module.exports = router;
