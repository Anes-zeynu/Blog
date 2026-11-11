require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./server/config/db.js");
const sessionMiddleware = require("./server/middleware/session.js");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use(expressLayouts);

app.use(sessionMiddleware);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");

// Routes
app.use("/", require("./server/routes/main.js"));
app.use("/", require("./server/routes/admin.js"));

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("failed to connect server", error.message);
    process.exit(1);
  }
};
startServer();
