const db = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  // console.log(process.env.MONGO_URI);
  try {
    await db.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log("Database Connected!");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
