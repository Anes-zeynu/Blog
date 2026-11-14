const authMiddleware = (req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Admin:", req.session?.admin);

  if (!req.session || !req.session.admin) {
    return res.redirect("/admin/login");
  }

  next();
};

module.exports = authMiddleware;
