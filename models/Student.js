const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "Student Name is Required!",
  },
  rollNo: {
    type: Number,
    required: "Student Roll Number is Required",
  },
  email: {
    type: String,
    required: "Student Email is Required!",
  },
  password: {
    type: String,
    required: "Student Password is Required!",
  },
  class: {
    type: String,
    required: "Student Class is Required!",
  },
  department: {
    type: String,
    required: "Student Department is Required!",
  },
});

module.exports = Student = mongoose.model("Student", StudentSchema);
