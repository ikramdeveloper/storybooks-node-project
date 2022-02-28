const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, resp) => resp.redirect("/dashboard")
);

router.get("/logout", (req, resp) => {
  req.logOut();
  resp.redirect("/");
});

module.exports = router;
