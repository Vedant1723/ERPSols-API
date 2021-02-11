const mongoose = require("mongoose");
const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Teacher Name is Required!",
  },
  email: {
    type: String,
    required: "Teacher Email is Required!",
  },
  password: {
    type: String,
    required: "Teacher Password is Required!",
  },
  class: {
    type: String,
    required: "Teacher Class is Required!",
  },
  department: {
    type: String,
    required: "Teacher Department is Required!",
  },
});

module.exports = Teacher = mongoose.model("Teacher", TeacherSchema);
