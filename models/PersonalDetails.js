const mongoose = require("mongoose");

const PersonalDetailsSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  photo: {
    type: String,
  },
  parents: {
    fatherName: {
      type: String,
    },
    fatherNo: {
      type: String,
    },
    motherName: {
      type: String,
    },
    motherNo: {
      type: String,
    },
  },
  address: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  category: {
    type: String,
  },
  nationality: {
    type: String,
  },
});

module.exports = PeronalDetails = mongoose.model(
  "Personal Details",
  PersonalDetailsSchema
);
