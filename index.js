const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path");
app.use(require("cors")());

connectDB();

app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/student", require("./routes/api/student"));
app.use("/api/teacher", require("./routes/api/teacher"));
app.use("/api/placements", require("./routes/api/placement"));

app.listen(PORT, () => {
  console.log("Server Connected on PORT : ", PORT);
});
