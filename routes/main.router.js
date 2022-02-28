const express = require("express");
const router = express.Router();
const Story = require("../models/story.model");

const { ensureAuth, ensureGuest } = require("../middleware/auth.middleware");

// Login/Landing Page
router.get("/", ensureGuest, (req, resp) => {
  resp.render("login", {
    layout: "login",
  });
});

// Dashboard
router.get("/dashboard", ensureAuth, async (req, resp) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    resp.render("dashboard", {
      name: req.user.firstName,
      stories,
    });
  } catch (err) {
    console.log(err);
    resp.render("errors/500");
  }
});

module.exports = router;
