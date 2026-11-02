require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const app = express();
const port = 3000;

//templatte engine

app.use(expressLayout);

app.get("/", (req, res) => {
  res.send("welcome");
});
app.listen(port, () => {
  console.log(`express app is run in ${port}`);
});
