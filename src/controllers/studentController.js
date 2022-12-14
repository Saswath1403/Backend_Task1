const studentModel = require("../models/studentModel.js");
const {
  isValidObjectId,
  isValid,
  isEmpty,
  isNumber,
} = require("../validations/validator.js"); // Importing Validators

//---------------------------------------[3rd Api => Registering Student's performance]-------------------------------------------//

const registerStudent = async function (req, res) {
  try {
    const body = req.body;
    let { name, subject, marks } = body;

    if (!isEmpty(body))
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty!" });

    if (!name)
      return res
        .status(400)
        .send({ status: false, message: "Name is mandatory!" });
    if (!isValid(name))
      return res
        .status(400)
        .send({ status: false, message: "The input string cannot be empty!" });
    name = name
      .split(" ")
      .filter((x) => x)
      .join(" ");

    if (!subject)
      return res
        .status(400)
        .send({ status: false, message: "subject is mandatory!" });
    if (!isValid(subject))
      return res
        .status(400)
        .send({ status: false, message: "The input string cannot be empty!" });
    subject = subject
      .split(" ")
      .filter((x) => x)
      .join(" ");

    if (!marks)
      return res
        .status(400)
        .send({ status: false, message: "marks is mandatory!" });
    if (!isNumber(marks))
      return res.status(400).send({
        status: false,
        message: "The input should be in number only!",
      });

    const existingStudent = await studentModel.findOne({
      name: name,
      subject: subject,
      isDeleted: false,
    });
    if (existingStudent) {
      let updatedMarks = existingStudent.marks + marks;
      const updatedStudent = await studentModel.findOneAndUpdate(
        { name: name, subject: subject, isDeleted: false },
        { $set: { updatedMarks, updatedAt: new Date() } },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        message: `${existingStudent.name} marks updated!`,
        updatedStudent,
      });
    } else {
      const create = await studentModel.create(body);
      return res.status(201).send({
        status: true,
        message: `${name} has been registred!`,
        data: create,
      });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//---------------------------------------[4th Api => Fetching Student List with Query Params]-------------------------------------------//

const getStudentList = async function (req, res) {
  try {
    const studentQuery = req.query;
    const filter = { isDeleted: false }; // Object Manupulation
    const { name, subject } = studentQuery;

    if (!isEmpty(studentQuery))
      return res.status(400).send({
        status: false,
        msg: "Please provide required filter to fetch the data!",
      });

    if (name) {
      if (!isValid(name)) {
        return res.status(400).send({ status: false, msg: "name is invalid!" });
      } else {
        filter.name = name.trim();
      }
    }
    if (subject) {
      if (!isValid(subject)) {
        return res
          .status(400)
          .send({ status: false, msg: "subject is invalid!" });
      } else {
        filter.subject = subject.trim();
      }
    }

    const studentList = await studentModel
      .find(filter)
      .select({ name: 1, subject: 1, marks: 1 });

    if (studentList.length === 0)
      return res
        .status(400)
        .send({ status: false, msg: "No such data found!" });

    const sortedList = studentList.sort((a, b) => a.name.localeCompare(b.name)); // Sorting in Alphabetical Order

    res.status(200).send({ status: true, message: "Student list", sortedList });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

//-------------------------------[5th Api => Fetching Student details with StudentId]-----------------------------//

const getStudentById = async function (req, res) {
  try {
    const studentId = req.params.studentId;
    if (!isValidObjectId(studentId))
      return res
        .status(400)
        .send({ status: false, message: "Invalid Student ID in the params!" });
    let student = await studentModel.findOne({
      _id: studentId,
      isDeleted: false,
    });
    if (!student)
      return res
        .status(404)
        .send({ status: false, message: "student not found!" });

    res.status(200).send({
      status: true,
      message: `${student.name} details is as follows:`,
      data: student,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//--------------------------------------[6th Api => Editing Student details]-----------------------------------------//

const updateStudent = async function (req, res) {
  try {
    let studentId = req.params.studentId;
    const body = req.body;
    let { name, subject, marks } = body;
    if (!isEmpty(body))
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty!" });

    if (!isValid(name))
      return res.status(400).send({ status: false, msg: "Please enter name!" });

    if (!isValid(subject))
      return res
        .status(400)
        .send({ status: false, msg: "Please enter subject!" });

    if (!marks) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter marks!" });
    }
    if (!isNumber(marks))
      return res
        .status(400)
        .send({ status: false, msg: "Please enter marks in number format!" });

    let student = await studentModel.findOne({
      name: name,
      subject: subject,
      marks: marks,
      isDeleted: false,
    });

    if (student) {
      return res.status(409).send({
        status: false,
        msg: "Cannot update, a student with the same details alreay exists in the database!",
      });
    } else {
      const updatedStudent = await studentModel.findOneAndUpdate(
        { _id: studentId },
        { $set: { name, subject, marks, updatedAt: new Date() } },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        message: "student updated successfully!",
        updatedStudent,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//------------------------------[7th Api => Deleting Student Records with Query Params]-------------------------------//

const deleteStudents = async function (req, res) {
  try {
    const studentQuery = req.query;
    const filter = { isDeleted: false }; // Object Manupulation
    const { name, subject } = studentQuery;

    if (!isEmpty(studentQuery))
      return res.status(400).send({
        status: false,
        msg: "Please provide required filter to delete the data!",
      });

    if (name) {
      if (!isValid(name)) {
        return res.status(400).send({ status: false, msg: "name is invalid!" });
      } else {
        filter.name = name.trim();
      }
    }
    if (subject) {
      if (!isValid(subject)) {
        return res
          .status(400)
          .send({ status: false, msg: "subject is invalid!" });
      } else {
        filter.subject = subject.trim();
      }
    }

    await studentModel.updateMany(
      filter,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    res.status(200).send({
      status: true,
      message: "Requested data has been removed!",
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//---------------------------------------[8th Api => Deleting a Student by ID]-------------------------------------------//

const deleteStudentById = async (req, res) => {
  try {
    let studentId = req.params.studentId;
    if (!isValidObjectId(studentId))
      return res
        .status(400)
        .send({ status: false, msg: "StudentId is invalid!" });

    let student = await studentModel.findOne({
      _id: studentId,
      isDeleted: false,
    });
    if (!student)
      return res
        .status(404)
        .send({ status: false, message: "Student not found!" });

    await studentModel.findOneAndUpdate(
      { _id: studentId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    res.status(200).send({
      status: true,
      message: `${student.name} has been removed!`,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// Destructuring & Exporting modules
module.exports = {
  registerStudent,
  getStudentList,
  getStudentById,
  updateStudent,
  deleteStudents,
  deleteStudentById,
};
