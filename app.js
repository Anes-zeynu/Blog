require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const app = express();
const port = 3000;

app.use(express.static("public"));
//templatte engine

app.use(expressLayout);
app.set("layout", "/layouts/main");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.send("welcome");
});
app.listen(port, () => {
  console.log(`express app is run in ${port}`);
});
