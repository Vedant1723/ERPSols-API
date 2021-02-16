const Placement = require("../../models/Placement");
const Teacher = require("../../models/Teacher");

const router = require("express").Router();
const sgMail = require("@sendgrid/mail");
const Student = require("../../models/Student");
sgMail.setApiKey(
  "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"
);

//@GET ALl Placements
router.get("/getAllPlacements", async (req, res) => {
  try {
    const placements = await Placement.find();
    if (placements.length == 0) {
      return res.status(400).json({ msg: "No Placements Available" });
    }
    res.json(placements);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Create or Update Placement
router.post("/createPlacement", async (req, res) => {
  const {
    companyName,
    designation,
    location,
    ctc,
    placementType,
    department,
    companySite,
  } = req.body;
  var placementFields = {};
  try {
    if (companyName) placementFields.companyName = companyName;
    if (designation) placementFields.designation = designation;
    if (ctc) placementFields.ctc = ctc;
    if (location) placementFields.location = location;
    if (placementType) placementFields.placementType = placementType;
    if (department) placementFields.department = department;
    if (companySite) placementFields.companySite = companySite;
    var placement = new Placement(placementFields);
    await placement.save();
    const teachers = await Teacher.find({ department: req.body.department });
    const students = await Student.find({ department: req.body.department });
    if (teachers.length != 0) {
      var emailList = [];
      emailList.push(
        teachers.map((teacher) => {
          return teacher.email;
        })
      );
      if (students.length != 0) {
        emailList.push(
          students.map((student) => {
            return student.email;
          })
        );
      }
      for (var i = 0; i < emailList.length; i++) {
        const msg = {
          to: emailList[i],
          from: "vedant.pruthi.io@gmail.com",
          subject: "Placement Aareli",
          text: "First Message via Send Grid",

          html:
            "<div style='border-radius:10px; border-style:solid; border-width:1px; padding:10px'><p>Greetings from ERP Sols</p><p>Hello " +
            companyName +
            " is Hiring for " +
            designation +
            "</p><p>Details are:</p><p>CTC : <b>" +
            ctc +
            "</b></p><p>Location : <b>" +
            location +
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
      }
      console.log(emailList);
    } else {
      console.log("No Teachers of this department");
    }
    res.json({ msg: "Placement Created!", placement: placement });
  } catch (error) {
    console.log(error.message);
  }
});

//@PUT Route
//@DESC Update Specific Placement
router.put("/update/:id", async (req, res) => {
  const {
    companyName,
    designation,
    location,
    ctc,
    placementType,
    department,
    companySite,
  } = req.body;
  var placementFields = {};
  try {
    if (companyName) placementFields.companyName = companyName;
    if (designation) placementFields.designation = designation;
    if (ctc) placementFields.ctc = ctc;
    if (location) placementFields.location = location;
    if (placementType) placementFields.placementType = placementType;
    if (department) placementFields.department = department;
    if (companySite) placementFields.companySite = companySite;
    var placement = await Placement.findOne({ _id: req.params.id });
    if (!placement) {
      return res.json({ msg: "No Placement Found!" });
    }
    placement = await Placement.findOneAndUpdate(
      { _id: req.params.id },
      { $set: placementFields },
      { new: true }
    );
    res.json({ msg: "Placement Updated", placement: placement });
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.json({ msg: "Please Enter a Valid Placement ID" });
    }
  }
});

//@DELETE Route
//@DESC Delete Placement By ID
router.delete("/delete/:id", async (req, res) => {
  try {
    await Placement.findOneAndDelete(req.params.id);
    res.json({ msg: "Placement Deleted!" });
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.json({ msg: "Please Enter a Valid Placement ID" });
    }
  }
});
module.exports = router;
