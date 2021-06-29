const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const studentAuth = require("../../middleware/studentAuth");
const teacherAuth = require("../../middleware/teacherAuth");
const AcademicDetails = require("../../models/AcademicDetails");
const PersonalDetails = require("../../models/PersonalDetails");
const Student = require("../../models/Student");
const Teacher = require("../../models/Teacher");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const Placement = require("../../models/Placement");
const adminAuth = require("../../middleware/adminAuth");
const Admin = require("../../models/Admin");
const PlacementApplied = require("../../models/PlacementApplied");
const PlacedStudent = require("../../models/PlacedStudent");
const nodemailer = require("nodemailer");
const mailer = require("../../NodeMailer");

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

//@GET Students
router.get("/allStudents", adminAuth, async (req, res) => {
  try {
    var admin = await Admin.findById(req.admin.id);
    var students = await Student.find({ institute: admin.institute }).sort({
      rollNo: -1,
    });
    if (students.length == 0) {
      return res.json({ msg: "No students Found for this Institute!" });
    }
    res.json(students);
  } catch (error) {
    console.log(error.message);
  }
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
    tenth,
    twelth,
    graduation,
    institute,
  } = req.body;
  var studentFields = {};
  try {
    if (institute) studentFields.institute = institute;
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
    if (tenth) studentFields.tenth = tenth;
    if (twelth) studentFields.twelth = twelth;
    if (graduation) studentFields.graduation = graduation;
    var std = await Student.findOne({ rollNo });
    if (std) {
      return res.json({ msg: "Roll No Existed!" });
    }
    std = await Student.findOne({ email });
    if (std) {
      return res.json({ msg: "Email Existed" });
    }
    var student = new Student(studentFields);
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);

    var transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 5000,
      auth: {
        user: "vedant.pruthi.io@gmail.com",
        pass: "System.in_1723",
      },
    });
    const msg = {
      to: student.email,
      from: "vedant.pruthi.io@gmail.com",
      subject: "Account Created",
      text: "First Message via Send Grid",

      html:
        "<div style='border-radius:10px; border-style:solid; border-width:1px; padding:10px'><p>Greetings from ERP Sols</p><p>Hello " +
        student.name +
        ". Your Account for ERP Sols is Created!</p><p>Your Credentials are:</p><p>Emp ID : <b>" +
        student.rollNo +
        "</b></p><p>Password : <b>" +
        password +
        "</b></p><p>Thankyou</p><p>Regards</p><p>Admin</p><p>Team ERP Sols.</p></div>",
    };
    await mailer(transport, msg);
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
        res.json({
          msg: "Student Created Successfully!",
          token: token,
          success: true,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Student Login
router.post("/login", async (req, res) => {
  const { rollNo, password } = req.body;
  try {
    var student = await Student.findOne({ rollNo });
    if (!student) {
      return res.json({ msg: "Student Not Found!" });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.json({ msg: "Invalid Credentialss!" });
    }

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
        res.json({
          msg: "Student Logged in Successfully!",
          token: token,
          student: student,
        });
      }
    );
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
router.delete("/delete/:id", adminAuth, async (req, res) => {
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

//@GET Applied Students of Specific Placement
router.get("/getStudents/:pID", adminAuth, async (req, res) => {
  try {
    var admin = await Admin.findById(req.admin.id);
    var appliedPlacements = await PlacementApplied.find({
      institute: admin.institute,
      placementID: req.params.pID,
    });

    res.json(appliedPlacements);
  } catch (error) {
    console.log(error.message);
  }
});

//@GET Placements by Specific Department of Student
router.get("/allPlacements", studentAuth, async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);
    const placements = await Placement.find({ department: student.department });

    res.json(placements);
  } catch (error) {
    console.log(error.message);
  }
});

//@Apply For Placement
router.get("/apply/placement/:pID", studentAuth, async (req, res) => {
  var placementFields = {};
  try {
    var placement = await Placement.findById(req.params.pID);
    if (!placement) {
      return res.json({ msg: "Enter a Valid Placement ID" });
    }
    var student = await Student.findById(req.student.id);
    placementFields.placementID = req.params.pID;
    placementFields.studentID = req.student.id;
    placementFields.studentName = student.name;
    placementFields.studentEmail = student.email;
    placementFields.studentNumber = "";
    placementFields.batch = student.batchYear;
    placementFields.studentClass = student.classOfStudent;
    placementFields.studentRollNumber = student.rollNo;
    placementFields.department = student.department;

    placementFields.institute = student.institute;
    var appliedPlacement = await PlacementApplied.findOne({
      placementID: req.params.pID,
      studentID: req.student.id,
    });
    if (appliedPlacement) {
      return res.json({ msg: "Already Applied for this Placement" });
    }
    appliedPlacement = new PlacementApplied(placementFields);
    await appliedPlacement.save();
    res.json({ msg: "Placement Applied", appliedPlacement: appliedPlacement });
  } catch (error) {
    console.log(error.message);
  }
});

//@GET Placed Students of Specific Company
router.get("/getPlaced/:pID", adminAuth, async (req, res) => {
  try {
    var admin = await Admin.findById(req.admin.id);
    var students = await PlacedStudent.find({
      institute: admin.institute,
      placementID: req.params.pID,
    });
    if (students.length == 0) {
      return res.json({ msg: "No Students Placed in this Company" });
    }
    res.json(students);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Placed Student by their ID and Placement ID
router.post("/setPlaced/:sID/:pID", async (req, res) => {
  const { location, ctc, placementType } = req.body;
  var placementFields = {};
  try {
    var placement = await Placement.findById(req.params.pID);
    var student = await Student.findById(req.params.sID);
    placementFields.placementID = req.params.pID;
    placementFields.studentID = req.params.sID;
    placementFields.studentName = student.name;
    placementFields.studentEmail = student.email;
    placementFields.studentNumber = "";
    placementFields.batch = student.batchYear;
    placementFields.studentClass = student.classOfStudent;
    placementFields.studentRollNumber = student.rollNo;
    placementFields.department = student.department;
    placementFields.location = location;
    placementFields.ctc = ctc;
    placementFields.placementType = placementType;
    placementFields.institute = placement.institute;
    var placedStudent = await PlacedStudent.findOne({
      studentID: req.params.sID,
      placmentID: req.params.pID,
    });
    if (placedStudent) {
      return res.json({ msg: "Student Already Set To Placed of this Company" });
    }
    placedStudent = new PlacedStudent(placementFields);
    await placedStudent.save();
    res.json({
      success: true,
      msg: "Student Set to Placed of this Company",
      placedStudent: placedStudent,
    });
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.json({ msg: "Please Entter a Valid ID" });
    }
  }
});

module.exports = router;
