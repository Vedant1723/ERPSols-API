const express = require("express");
const connectDB = require("./config/db");
const app = express();

app.use(require("cors")());

connectDB();

app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use("/api/admin", require("./routes/api/admin"));

app.listen(PORT, () => {
  console.log("Server Connected on PORT : ", PORT);
});
