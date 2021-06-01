const mongoose = require("mongoose");

const PlacedStudentSchema = new mongoose.Schema({
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  placementID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  studentName: {
    type: String,
  },
  studentEmail: {
    type: String,
  },
  studentNumber: {
    type: String,
  },
  batch: {
    type: String,
  },
  studentClass: {
    type: String,
  },
  studentRollNumber: {
    type: String,
  },
  department: {
    type: String,
  },
  institute: {
    type: String,
  },
  ctc: {
    type: String,
  },
  placementType: {
    type: String,
  },
  location: {
    address: {
      type: String,
    },
    city: {
      type: String,
    },
  },
});

module.exports = PlacedStudent = mongoose.model(
  "PlacedStudent",
  PlacedStudentSchema
);
