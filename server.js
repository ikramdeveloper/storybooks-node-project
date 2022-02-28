// Dotenv Config
require("dotenv").config({ path: "./config/config.env" });

const connectMongo = require("./config/mongo");

const app = require("./app");

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectMongo();
  app.listen(PORT, () =>
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`
    )
  );
}

startServer();
