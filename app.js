require("dotenv").config();

const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("welcome");
});
app.listen(port, () => {
  console.log(`express app is run in ${port}`);
});
