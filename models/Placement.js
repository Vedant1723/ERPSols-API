const mongoose = require("mongoose");

const PlacementSchema = new mongoose.Schema({
  companyName: {
    type: String,
  },
  designation: {
    type: String,
  },
  ctc: {
    type: String,
  },
  location: {
    type: String,
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
});

module.exports = Placement = mongoose.model("Placement", PlacementSchema);
