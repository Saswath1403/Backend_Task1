const express = require("express");
const route = express.Router();
const { authentication, authorisation } = require("../middlewares/auth");
const { registerAdmin, loginAdmin } = require("../controllers/adminController"); // Destructuring & Importing
const {
  registerStudent,
  getStudentList,
  getStudentById,
  updateStudent,
  deleteStudents,
  deleteStudentById,
} = require("../controllers/studentController"); // Destructuring & Importing

//---------------------------------------------[ADMIN APIS]-----------------------------------------//

// Post Api Routes
route.post("/admin/register", registerAdmin);
route.post("/admin/login", loginAdmin);

//--------------------------------------------[STUDENT APIS]----------------------------------------//

// Post Api Route
route.post("/student/register/:adminId", authentication, registerStudent);

// Get Api Routes
route.get("/students", authentication, getStudentList);
route.get("/student/:studentId", authentication, getStudentById);

// Update Api Route
route.put(
  "/student/:adminId/:studentId",
  authentication,
  authorisation,
  updateStudent
);

// Delete Api Routes
route.delete(
  "/students/:adminId",
  authentication,
  authorisation,
  deleteStudents
);
route.delete(
  "/student/:adminId/:studentId",
  authentication,
  authorisation,
  deleteStudentById
);

module.exports = route; // Exporting route
