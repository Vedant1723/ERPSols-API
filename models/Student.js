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
  classOfStudent: {
    type: String,
    required: "Student Class is Required!",
  },
  department: {
    type: String,
    required: "Student Department is Required!",
  },
  batchYear: {
    type: String,
    requried: "Student Batch Year is Required!",
  },
  passedOutYear: {
    type: String,
    required: "Student Passed out Year is Required!",
  },
  gender: {
    type: String,
  },
  resume: {
    type: String,
  },
  adhaarCard: {
    type: String,
  },
});

module.exports = Student = mongoose.model("Student", StudentSchema);
