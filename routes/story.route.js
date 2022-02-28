const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth.middleware");

const Story = require("../models/story.model");

router.get("/", ensureAuth, async (req, resp) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    resp.render("stories/index", { stories });
  } catch (err) {
    console.log(err);
    resp.render("errors/500");
  }
});

router.get("/add", ensureAuth, (req, resp) => {
  resp.render("stories/add");
});

router.get("/:id", ensureAuth, async (req, resp) => {
  try {
    const story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      resp.render("errors/404");
    } else {
      resp.render("stories/single_story", { story });
    }
  } catch (err) {
    console.error(err);
    resp.render("errors/500");
  }
});

router.get("/edit/:id", ensureAuth, async (req, resp) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
      return resp.render("errors/404");
    }

    if (story.user != req.user.id) {
      resp.redirect("/stories");
    } else {
      resp.render("stories/edit", { story });
    }
  } catch (err) {
    console.error(err);
    resp.render("errors/500");
  }
});

router.get("/user/:userId", ensureAuth, async (req, resp) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    resp.render("stories/index", { stories });
  } catch (err) {
    console.error(err);
    resp.render("errors/500");
  }
});

router.post("/", ensureAuth, async (req, resp) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    resp.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    resp.render("errors/500");
  }
});

router.put("/:id", ensureAuth, async (req, resp) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return resp.render("errors/404");
    }

    if (story.user != req.user.id) {
      resp.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      resp.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    resp.render("errors/500");
  }
});

router.delete("/:id", ensureAuth, async (req, resp) => {
  try {
    await Story.remove({ _id: req.params.id });
    resp.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    resp.render("errors/500");
  }
});

module.exports = router;
