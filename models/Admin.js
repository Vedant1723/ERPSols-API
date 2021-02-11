const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Admin name is Required!",
  },
  email: {
    type: String,
    required: "Admin Email is Required!",
  },
  password: {
    type: String,
    required: "Admin Password is Required!",
  },
  designation: {
    type: String,
    required: "Admin Designation is Required!",
  },
  institute: {
    type: String,
    required: "Admin Institute is Required!",
  },
});

module.exports = Admin = mongoose.model("Admin", AdminSchema);
