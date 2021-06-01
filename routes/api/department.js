const Department = require("../../models/Department");
const router = require("express").Router();
const adminAuth = require("../../middleware/adminAuth");
const Admin = require("../../models/Admin");
const Teacher = require("../../models/Teacher");
const teacherAuth = require("../../middleware/teacherAuth");

//@GET Route
//@DESC Get All Departments
router.get("/", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    const departments = await Department.find({ institute: admin.institute });
    if (departments.length == 0) {
      return res.json({ msg: "No Departments Found!" });
    }
    res.json(departments);
  } catch (error) {
    console.log(error.message);
  }
});

//@GET Route
//@DESC Get All Departments
router.get("/teacher", teacherAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id);
    const departments = await Department.find({ institute: teacher.institute });
    if (departments.length == 0) {
      return res.json({ msg: "No Departments Found!" });
    }
    res.json(departments);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Create the Department
router.post("/create", adminAuth, async (req, res) => {
  const { deptName, deptCode } = req.body;
  var deptFields = {};
  try {
    const admin = await Admin.findById(req.admin.id);
    if (deptCode) deptFields.deptCode = deptCode;
    if (deptName) deptFields.deptName = deptName;
    deptFields.institute = admin.institute;
    var department = await Department.findOne({ deptCode: deptCode });
    if (department) {
      return res.json({ msg: "Department is Already Created!" });
    }
    department = new Department(deptFields);
    await department.save();
    res.json({ msg: "Department Created!", department: department });
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Assign Dean to the Department
router.post("/dean/:id", adminAuth, async (req, res) => {
  const { department } = req.body;
  var deptFields = {
    dean: {},
  };
  try {
    const admin = await Admin.findById(req.admin.id);
    var teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.json({ msg: "No teacher Found!" });
    }
    if (teacher.institute != admin.institute) {
      return res.json({ msg: "Invalid Institute.. Please Try Again" });
    }
    if (department != teacher.department) {
      return res.json({ msg: "Please Select a Valid Department." });
    }
    var dept = await Department.findOne({ deptName: department });
    deptFields.dean = teacher;
    if (!dept) {
      return res.json({ msg: "No Department Found!" });
    }
    dept = await Department.findOneAndUpdate(
      {
        deptName: department,
      },
      { $set: deptFields },
      { new: true }
    );
    res.json({ msg: "Dean Assigned Successfully!", department: dept });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
