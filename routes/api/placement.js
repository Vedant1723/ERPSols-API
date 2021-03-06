const Placement = require("../../models/Placement");
const Teacher = require("../../models/Teacher");

const router = require("express").Router();
const sgMail = require("@sendgrid/mail");
const Student = require("../../models/Student");
const adminAuth = require("../../middleware/adminAuth");
const Admin = require("../../models/Admin");
const nodemailer = require("nodemailer");
const mailer = require("../../NodeMailer");
sgMail.setApiKey(
  "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"
);

//@TODO
//DATE AND TIME to be settled down!

//@GET ALl Placements
router.get("/getAllPlacements", adminAuth, async (req, res) => {
  try {
    const adminInstitute = await Admin.findById(req.admin.id);
    const placements = await Placement.find({
      institute: adminInstitute.institute,
    });
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
router.post("/createPlacement", adminAuth, async (req, res) => {
  const {
    companyName,
    designation,
    location,
    ctc,
    placementType,
    date,
    time,
    eligibilityCriteria,
    department,
    companySite,
    venue,
    mainCampus,
    locations,
    aboutCompany,
    batchYear,
    skills,
  } = req.body;
  var placementFields = {};
  try {
    if (companyName) placementFields.companyName = companyName;
    if (skills) placementFields.skills = skills;
    if (aboutCompany) placementFields.aboutCompany = aboutCompany;
    if (batchYear) placementFields.batchYear = batchYear;
    if (date) placementFields.date = date;
    if (time) placementFields.time = time;
    if (eligibilityCriteria)
      placementFields.eligibilityCriteria = eligibilityCriteria;
    if (venue) placementFields.venue = venue;
    if (mainCampus) placementFields.mainCampus = mainCampus;
    if (locations) placementFields.locations = locations;
    if (designation) placementFields.designation = designation;
    if (ctc) placementFields.ctc = ctc;
    if (location) placementFields.location = location;
    if (placementType) placementFields.placementType = placementType;
    if (department) placementFields.department = department;
    if (companySite) placementFields.companySite = companySite;
    if (eligibilityCriteria)
      placementFields.eligibilityCriteria = eligibilityCriteria;
    var adminInstitute = await Admin.findById(req.admin.id);
    placementFields.institute = adminInstitute.institute;
    var placement = new Placement(placementFields);
    await placement.save();
    var admin = await Admin.findById(req.admin.id);
    const teachers = await Teacher.find({
      department: req.body.department,
      institute: admin.institute,
    });
    const students = await Student.find({
      department: req.body.department,
      institute: admin.institute,
    });
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
      var transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 5000,
        auth: {
          user: "vedant.pruthi.io@gmail.com",
          pass: "System.in_1723",
        },
      });
      var graduationMarks = eligibilityCriteria.graduation
        ? eligibilityCriteria.graduation
        : "--";

      const msg = {
        to: emailList,
        from: "vedant.pruthi.io@gmail.com",
        subject: "Placement Incoming",
        html:
          "   <div style='border-radius:10px; border-style:solid; border-width:1px; padding:10px'><p>Greetings from Placement Assistor</p><p>Hello <b> " +
          companyName +
          "</b> is Hiring for <b> " +
          designation +
          " </b></p><p>" +
          "<p><h3>About Company</h3></p>" +
          aboutCompany +
          "</p><p>Job Details are:</p><p><b>Skills</b> :" +
          skills +
          "</p><p><b>>Eligibility Criteria</b> :<div style=`display:flex;flex-direction: column;`><div><b>10th</b> : " +
          eligibilityCriteria.tenth +
          "</div><div><b>12th</b> : " +
          eligibilityCriteria.twelth +
          "</div><div><b>Graduation</b> :" +
          graduationMarks +
          "</div></div></p><p>CTC : <b>" +
          ctc +
          "</b></p><p>Location : <b>" +
          location +
          "</b></p><p>Website : <a href=" +
          companySite +
          ">" +
          companySite +
          "</a></p><p>Placement Type : <b>" +
          placementType +
          "</b></p><p>Venue : <b>" +
          venue +
          "</b></p><p>Date : <b>" +
          date +
          "</b></p><p>Time : <b>" +
          time +
          "</b></p><p><b> Note : Please contact your institute's Admin or Department for more details </b></p><p>Thankyou</p><p>Regards</p><p>Admin</p><p>" +
          placementFields.institute +
          "</p><p>Team Placement Assistor.</p></div>",
      };
      await mailer(transport, msg);
      console.log(emailList);
    } else {
      console.log("No Teachers of this department");
    }
    res.json({
      success: true,
      msg: "Placement Created!",
      placement: placement,
    });
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
    institute,
    mainCampus,
    locations,
    venue,
    placementStatus,
    date,
    time,
    eligibilityCriteria,
    batchYear,
  } = req.body;
  var placementFields = {};
  try {
    if (date) placementFields.date = date;
    if (batchYear) placementFields.batchYear = batchYear;
    if (time) placementFields.time = time;
    if (eligibilityCriteria)
      placementFields.eligibilityCriteria = eligibilityCriteria;
    if (companyName) placementFields.companyName = companyName;
    if (locations) placementFields.locations = locations;
    if (mainCampus) placementFields.mainCampus = mainCampus;
    if (institute) placementFields.institute = institute;
    if (venue) placementFields.venue = venue;
    if (placementStatus) placementFields.placementStatus = placementStatus;
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

//@GET Route
//@DESC Active/In-Active the placements
router.get("/change/status/placement/:id", async (req, res) => {
  try {
    var placement = await Placement.findById(req.params.id);
    if (!placement) {
      return { msg: "Placement ID is invalid" };
    }
    if (placement.placementStatus == "In-Active") {
      placement = await Placement.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { placementStatus: "Active" } },
        { new: true }
      );
    } else {
      placement = await Placement.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { placementStatus: "In-Active" } },
        { new: true }
      );
    }
    return {
      success: true,
      msg: "Status Updated!",
    };
  } catch (error) {
    console.log(error.message);
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
