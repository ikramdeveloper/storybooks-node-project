const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectMongo;
