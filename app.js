const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const mainRouter = require("./routes/main.router");
const authRouter = require("./routes/auth.router");
const storyRouter = require("./routes/story.route");

const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// Passport config
require("./config/passport")(passport);

const clientP = mongoose
  .connect(process.env.MONGO_URI)
  .then((m) => m.connection.getClient());

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Morgan Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(
  ".hbs",
  engine({
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon,
      select,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

// Sessions
app.use(
  session({
    secret: "keyboard mouse",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: clientP,
    }),
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Set Global var
app.use((req, resp, next) => {
  resp.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", mainRouter);
app.use("/auth", authRouter);
app.use("/stories", storyRouter);

module.exports = app;
