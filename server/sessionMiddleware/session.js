const session = require("express-session");
const { MongoStore } = require("connect-mongo");

const sessionMiddleware = session({
  secret: process.env.SECRET_KEY,

  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MyBlogURL,
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
