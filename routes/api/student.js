const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const teacherAuth = require("../../middleware/teacherAuth");
const AcademicDetails = require("../../models/AcademicDetails");
const PersonalDetails = require("../../models/PersonalDetails");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./studentUploads",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

//@GET Route
//@GET All Students of Respective Institute or Departmnet
//@TODO To add Teacher Auth as a Middleware
router.get("/all", teacherAuth, async (req, res) => {
  console.log(req.teacher.id);
  try {
    const teacher = await Teacher.findById(req.teacher.id);
    const students = await Student.find({ department: teacher.department });
    if (students.length == 0) {
      return res.json({ msg: "No Students Added Yet!" });
    }
    res.json(students);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Student Create or Student Signup
router.post("/signup", async (req, res) => {
  const {
    name,
    email,
    password,
    rollNo,
    classOfStudent,
    designation,
    department,
    gender,
    adhaarCard,
    batchYear,
    passedOutYear,
  } = req.body;
  var studentFields = {};
  try {
    if (name) studentFields.name = name;
    if (email) studentFields.email = email;
    if (password) studentFields.password = password;
    if (designation) studentFields.designation = designation;
    if (department) studentFields.department = department;
    if (gender) studentFields.gender = gender;
    if (adhaarCard) studentFields.adhaarCard = adhaarCard;
    if (batchYear) studentFields.batchYear = batchYear;
    if (passedOutYear) studentFields.passedOutYear = passedOutYear;
    if (rollNo) studentFields.rollNo = rollNo;
    if (classOfStudent) studentFields.classOfStudent = classOfStudent;
    var std = await Student.findOne({ rollNo });
    if (std) {
      return res.json({ msg: "Roll No Existed!" });
    }
    var student = new Student(studentFields);
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);
    await student.save();
    const payload = {
      student: {
        id: student.id,
      },
    };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 3600000000 },
      (err, token) => {
        if (err) throw err;
        res.json({ msg: "Student Created Successfully!", token: token });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Student Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    var student = await Student.findOne({ email });
    if (!student) {
      return res.json({ msg: "Student Not Found!" });
    }
    const isMatch = await bcrypt.compare(student.password, password);
    if (!isMatch) {
      return res.json({ msg: "Invalid Credentialss!" });
    }
    res.json(studetn);
  } catch (error) {
    console.log(error.message);
  }
});

//@PUT route
//@DESC Update Student by ID
router.put("/update/:id", async (req, res) => {
  const { name, email, password, designation, institute } = req.body;
  const studentFields = {};
  try {
    if (name) studentFields.name = name;
    if (email) studentFields.email = email;
    if (password) studentFields.password = password;
    if (designation) studentFields.designation = designation;
    if (institute) studentFields.institute = institute;
    var student = await Student.findOne({ email });
    if (student) {
      student = await Student.findOneAndUpdate(
        { _id: req.params.id },
        { $set: studentFields },
        { new: true }
      );
      return res.json({ msg: "Student Updated", studetn: student });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//@DELETE Route
//@DESC Delete Student By ID
router.delete("/delete/:id", async (req, res) => {
  try {
    await Student.findOneAndDelete(req.params.id);
    await AcademicDetails.findOneAndDelete({ userID: req.params.id });
    await PersonalDetails.findOneAndDelete({ userID: req.params.id });
    res.json({ msg: "Student and its Details Deleted!" });
  } catch (error) {
    console.log(error.message);
  }
});

//@POST ROute
//@DESC  Create or Update Student Academics Profile
router.post("/createAcademics/:id", teacherAuth, async (req, res) => {
  const { school, college, experience } = req.body;
  const academicFields = {};
  try {
    if (school) academicFields.school = school;
    if (college) academicFields.college = college;
    if (experience) academicFields.experience = experience;
    academicFields.userID = req.params.id;
    var studentAcademics = await AcademicDetails.findOne({
      userID: req.params.id,
    });
    if (studentAcademics) {
      studentAcademics = await AcademicDetails.findOneAndUpdate(
        { _id: req.params.id },
        { $set: academicFields },
        { new: true }
      );
      return res.json({
        msg: "Student Academics Updated!",
        studentAcademics: studentAcademics,
      });
    }
    studentAcademics = new AcademicDetails(academicFields);
    await studentAcademics.save();
    res.json({
      msg: "Student Academics Created!",
      studentAcademics: studentAcademics,
    });
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Create or Update Student Personal Details
router.post("/createPersonalDetails/:id", async (req, res) => {
  const { parents, address, dateOfBirth, category, nationality } = req.body;
  var personalDetails = {};
  try {
    personalDetails.userID = req.params.id;
    if (parents) personalDetails.parents = parents;
    if (address) personalDetails.address;
    if (dateOfBirth) personalDetails.dateOfBirth = dateOfBirth;
    if (nationality) personalDetails.nationality = nationality;
    if (category) personalDetails.category = category;
    var studentPersonal = await PersonalDetails.findOne({
      userID: req.params.id,
    });
    if (studentPersonal) {
      studentPersonal = await PersonalDetails.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        { $set: personalDetails },
        {
          new: true,
        }
      );
      return res.json({
        msg: "Student Personal Details Updated!!",
        studentPersonal: studentPersonal,
      });
    }
    studentPersonal = new PersonalDetails(personalDetails);
    await studentPersonal.save();
    res.json({
      msg: "Student Personal Info Created!",
      studentPersonal: studentPersonal,
    });
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Upload Resume
router.post("/uploadResume/:id", upload.single("resume"), async (req, res) => {
  var academicDetailsFields = {};
  try {
    academicDetailsFields.resume = `http://${req.headers.host}/studentUploads/${req.file.filename}`;
    var academicDetails = await AcademicDetails.findOne({
      userID: req.params.id,
    });
    if (academicDetails) {
      academicDetails = await AcademicDetails.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: academicDetailsFields,
        },
        {
          new: true,
        }
      );
      return res.json({
        msg: "Student Resume Uploaded and Student Updated!",
        academicDetails: academicDetails,
      });
    }
    academicDetails = new AcademicDetails(academicDetailsFields);
    await academicDetails.save();
    res.json({
      msg: "Academic Details Created!",
      academicDetails: academicDetails,
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
