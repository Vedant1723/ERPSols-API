const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  deptName: {
    type: String,
  },
  dean: {
    type: Object,
  },
  deptCode: {
    type: String,
  },
  institute: {
    type: String,
  },
});

module.exports = Department = mongoose.model("Department", DepartmentSchema);
