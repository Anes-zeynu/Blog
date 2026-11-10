require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const connectDB = require("./server/config/db.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use(expressLayouts);

app.set("layout", "layouts/main");
app.set("view engine", "ejs");

app.use(cookieParser());
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
