const adminAuth = require("../../middleware/adminAuth");
const Admin = require("../../models/Admin");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//@GET Route
//@DESC GET All the Admins
router.get("/all", adminAuth, async (req, res) => {
  try {
    const admins = await Admin.find();
    if (admins.length == 0) {
      return res.json({ msg: "No Admins Created Yet!" });
    }
    res.json(admins);
  } catch (error) {
    console.log(error.message);
  }
});

//@GET Route
//@DESC Get Logged in Admin's Details
router.get("/getDetails", adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.json({ msg: "No Admin Found!" });
    }
    res.json(admin);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Create Admin
router.post("/signup", async (req, res) => {
  const { name, email, password, institute } = req.body;
  var adminFields = {};
  try {
    if (name) adminFields.name = name;
    if (email) adminFields.email = email;
    if (password) adminFields.password = password;
    adminFields.designation = "Admin";
    if (institute) adminFields.institute = institute;
    var admin = new Admin(adminFields);

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    await admin.save();
    const payload = {
      admin: {
        id: admin.id,
      },
    };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 36000000 },
      (err, token) => {
        if (err) throw err;
        res.json({
          msg: "Admin Created Successfully",
          token: token,
          admin: admin,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Log in Admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    var admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ msg: "Admin Not Found!" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ msg: "Please Enter a Valid Credentials!" });
    }
    const payload = {
      admin: {
        id: admin.id,
      },
    };
    jwt.sign(
      payload,
      process.env.jwtSecret,
      { expiresIn: 3600000000000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token: token });
      }
    );
  } catch (error) {
    console.log(error.message);
  }
});

//@TODO
//@PUT Route
//@DESC Update Logged in Admin Details

module.exports = router;
