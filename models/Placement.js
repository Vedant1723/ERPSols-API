const mongoose = require("mongoose");

const PlacementSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  designation: {
    type: String,
  },
  aboutCompany: {
    type: String,
  },
  ctc: {
    type: String,
  },
  location: {
    type: String,
  },
  mainCampus: {
    type: String,
  },
  locations: {
    type: [String],
  },
  placementType: {
    type: String,
  },
  department: {
    type: String,
  },
  companySite: {
    type: String,
  },
  institute: {
    type: String,
  },
  venue: {
    type: String,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  skills: {
    type: String,
  },
  eligibilityCriteria: {
    tenth: {
      type: Number,
    },
    twelth: {
      type: Number,
    },
    graduation: {
      type: Number,
    },
  },
  placementStatus: {
    type: String,
    default: "Active",
  },
  batchYear: {
    type: String,
  },
});

module.exports = Placement = mongoose.model("Placement", PlacementSchema);
