const session = require("express-session");
const mongoStore = require("connect-mongo");
const { collection } = require("../model/Admin");

const sessionMiddleware = session({
  scecret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: mongoStore.create({
    mongoURL: process.env.MyBlogURL,
    collectionName: "sessions",
  }),

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
});

module.exports = sessionMiddleware;
