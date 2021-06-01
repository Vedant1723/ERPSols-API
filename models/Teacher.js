const mongoose = require("mongoose");
const TeacherSchema = new mongoose.Schema({
  empID: {
    type: String,
    unique: true,
    required: "Employee ID is Required!",
  },
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
  department: {
    type: String,
    required: "Teacher Department is Required!",
  },
  institute: {
    type: String,
    required: "Teacher Institute is Required!",
  },
});

module.exports = Teacher = mongoose.model("Teacher", TeacherSchema);
