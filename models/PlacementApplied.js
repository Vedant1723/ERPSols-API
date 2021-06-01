const mongoose = require("mongoose");

const PlacementAppliedSchema = new mongoose.Schema({
  placementID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  studentID: {
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
});

module.exports = PlacementApplied = mongoose.model(
  "AppliedPlacements",
  PlacementAppliedSchema
);
