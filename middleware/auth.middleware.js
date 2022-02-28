module.exports = {
  ensureAuth: (req, resp, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      resp.redirect("/");
    }
  },
  ensureGuest: (req, resp, next) => {
    if (req.isAuthenticated()) {
      resp.redirect("/dashboard");
    } else {
      return next();
    }
  },
};
