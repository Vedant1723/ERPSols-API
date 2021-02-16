const mongoose = require("mongoose");
const AcademicDetailsSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  school: {
    tenth: {
      type: String,
    },
    tewelth: {
      type: String,
    },
  },
  college: {
    graduation: {
      type: String,
    },
    postGrad: {
      type: String,
    },
    phd: {
      type: String,
    },
  },
  experience: {
    company: {
      type: String,
    },
    yearsOfExp: {
      type: String,
    },
    type: {
      type: String,
    },
    package: {
      type: String,
    },
    details: {
      type: String,
    },
    additional: {
      type: String,
    },
  },
});

module.exports = AcademicDetails = mongoose.model(
  "AcademicDetails",
  AcademicDetailsSchema
);
