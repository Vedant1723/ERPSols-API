const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminAuth = require("../../middleware/adminAuth");
const teacherAuth = require("../../middleware/teacherAuth");
const Admin = require("../../models/Admin");
const Teacher = require("../../models/Teacher");
require("dotenv").config();
const AcademicDetails = require("../../models/AcademicDetails");
const PersonalDetails = require("../../models/PersonalDetails");
const multer = require("multer");
const path = require("path");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

const storage = multer.diskStorage({
  destination: "./uploads",
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

const genEmpID = () => {
  var digits = "0123456789";
  var id = "";
  for (let i = 0; i < 6; i++) {
    id += digits[Math.floor(Math.random() * 10)];
  }
  return "E" + id;
};

//@GET Route
//@DESC Get all the Teachers of Respective Institute or Department
router.get("/all", adminAuth, async (req, res) => {
  try {
    const adminDept = await Admin.findById(req.admin.id);
    const teachers = await Teacher.find({
      institute: adminDept.institute,
    }).sort({ department: -1 });
    if (teachers.length == 0) {
      return res.json({ msg: "No Teachers Found!" });
    }
    res.json(teachers);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Create Teacher or Signup
router.post("/signup", adminAuth, async (req, res) => {
  const { name, email, password, designation, department } = req.body;
  var teacherFields = {};
  try {
    if (name) teacherFields.name = name;
    if (email) teacherFields.email = email;
    if (designation) teacherFields.designation = designation;
    if (password) teacherFields.password = password;
    if (department) teacherFields.department = department;

    const adminInstitute = await Admin.findById(req.admin.id);
    teacherFields.institute = adminInstitute.institute;

    var teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({ msg: "Teacher already Exists" });
    }
    id = genEmpID();
    teacher = await Teacher.findOne({ empID: id });
    if (!teacher) {
      teacherFields.empID = id;
    } else {
      id = genEmpID();
    }
    teacher = new Teacher(teacherFields);
    const salt = await bcrypt.genSalt(10);
    teacher.password = await bcrypt.hash(teacher.password, salt);
    await teacher.save();

    const msg = {
      to: teacher.email,
      from: "vedant.pruthi.io@gmail.com",
      subject: "Account Created",
      text: "First Message via Send Grid",

      html:
        "<div style='border-radius:10px; border-style:solid; border-width:1px; padding:10px'><p>Greetings from ERP Sols</p><p>Hello " +
        teacher.name +
        ". Your Account for ERP Sols is Created!</p><p>Your Credentials are:</p><p>Emp ID : <b>" +
        teacher.empID +
        "</b></p><p>Password : <b>" +
        password +
        "</b></p><p>Thankyou</p><p>Regards</p><p>Admin</p><p>Team ERP Sols.</p></div>",
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email Sent", msg);
      })
      .catch((error) => {
        console.log(error.message);
      });
    const payload = {
      teacher: {
        id: teacher.id,
      },
    };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 360000000 },
      (err, token) => {
        if (err) throw err;
        res.json({ msg: "Teacher Created Successfully!", token: token });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
});

//@GET Route
//@DESC Get Logged in Teacher's Details
router.get("/getDetails", teacherAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id);
    if (!teacher) {
      return res.json({ msg: "No Teacher Found!" });
    }
    res.json(teacher);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Log in Teacher
router.post("/login", async (req, res) => {
  const { empID, password } = req.body;
  try {
    var teacher = await Teacher.findOne({ empID });
    if (!teacher) {
      return res.json({ msg: "Teacher Not Found!" });
    }
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials!" });
    }
    const payload = {
      teacher: {
        id: teacher.id,
      },
    };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 36000000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token: token });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
});

//@GET Route
//@DESC Get Academic Details
router.get("/getAcademics", teacherAuth, async (req, res) => {
  try {
    const academics = await AcademicDetails.findOne({ userID: req.teacher.id });
    if (!academics) {
      return res.status(400).json({ msg: "No Academic Details Added!" });
    }
    res.json(academics);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Create Academic Details
router.post("/createAcademics", teacherAuth, async (req, res) => {
  var academicFields = {};
  try {
    academicFields.userID = req.teacher.id;
    if (req.body.school) academicFields.school = req.body.school;
    if (req.body.college) academicFields.college = req.body.college;
    if (req.body.experience) academicFields.experience = req.body.experience;

    var academics = await AcademicDetails.findOne({ userID: req.teacher.id });
    if (academics) {
      academics = await AcademicDetails.findOneAndUpdate(
        {
          userID: req.teacher.id,
        },
        { $set: academicFields },
        { new: true }
      );
      return res.json({
        msg: "Academic Details Updated!",
        academics: academics,
      });
    }
    academics = new AcademicDetails(academicFields);
    await academics.save();
    res.json({ msg: "Academic Details Created!", academics: academics });
  } catch (error) {
    console.log(error.message);
  }
});

//@DELETE Route
//@DESC Delete Teacher by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    await Teacher.findOneAndDelete(req.params.id);
    res.json({ msg: "Teacher Deleted!" });
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.json({ msg: "Enter the Valid Teacher ID!" });
    }
  }
});

//@GET Route
//@DESC Get Personal Details of the Teacher
router.get("/getPersonalDetails", teacherAuth, async (req, res) => {
  try {
    const personalDetails = await PersonalDetails.findOne({
      userID: req.teacher.id,
    });
    if (!personalDetails) {
      return res.json({
        msg: "No Personal Details of the Teacher is Created Yet!",
      });
    }
    res.json(personalDetails);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Upload Photo
router.post(
  "/uploadPhoto",
  teacherAuth,
  upload.single("photo"),
  async (req, res) => {
    var personalDetailsFields = {};

    try {
      personalDetailsFields.userID = req.teacher.id;
      personalDetailsFields.photo = `http://${req.headers.host}/uploads/${req.file.filename}`;
      var personalDetails = await PersonalDetails.findOne({
        userID: req.teacher.id,
      });
      if (personalDetails) {
        personalDetails = await PeronalDetails.findOneAndUpdate(
          {
            userID: req.teacher.id,
          },
          {
            $set: personalDetailsFields,
          },
          {
            new: true,
          }
        );
        return res.json({
          msg: "Personal Details Updated!",
          personalDetails: personalDetails,
        });
      }
      personalDetails = new PeronalDetails(personalDetailsFields);
      await personalDetails.save();
      res.json({
        msg: "Personal Details Created!",
        personalDetails: personalDetails,
      });
    } catch (error) {
      console.log(error.message);
    }
  }
);

//@POST Route
//@DESC Create or Update Personal Details of the Teacher
router.post("/createPersonalDetails", teacherAuth, async (req, res) => {
  const { parents, address, dateOfBirth, category, nationality } = req.body;
  var personalDetailsFields = {};
  try {
    personalDetailsFields.userID = req.teacher.id;
    if (parents) personalDetailsFields.parents = parents;
    if (address) personalDetailsFields.address = address;
    if (dateOfBirth) personalDetailsFields.dateOfBirth = dateOfBirth;
    if (nationality) personalDetailsFields.nationality = nationality;
    if (category) personalDetailsFields.category = category;
    var personalDetails = await PersonalDetails.findOne({
      userID: req.teacher.id,
    });
    if (personalDetails) {
      personalDetails = await PeronalDetails.findOneAndUpdate(
        {
          userID: req.teacher.id,
        },
        {
          $set: personalDetailsFields,
        },
        {
          new: true,
        }
      );
      return res.json({
        msg: "Personal Details Updated!",
        personalDetails: personalDetails,
      });
    }
    personalDetails = new PeronalDetails(personalDetailsFields);
    await personalDetails.save();
    res.json({
      msg: "Personal Details Created!",
      personalDetails: personalDetails,
    });
  } catch (error) {
    console.log(error.message);
  }
});

//@GET Route
//@DESC Get All Details of the Teacher
router.get("/getAllDetails", teacherAuth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id).select("-password");
    const personalDetails = await PersonalDetails.findOne({
      userID: req.teacher.id,
    });
    const academicDetails = await AcademicDetails.findOne({
      userID: req.teacher.id,
    });
    res.json({
      teacher: teacher,
      personalDetails: personalDetails,
      academicDetails: academicDetails,
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
