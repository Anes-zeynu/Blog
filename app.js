require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./server/config/db.js");
const app = express();
const PORT = 5000 || process.env.PORT;

app.use(express.static("public"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main.js"));
app.listen(PORT, (req, res) => {
  console.log(`srver is running on http://localhost:${PORT}`);
});
