const adminModel = require("../models/adminModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  isValid,
  isEmpty,
  isValidEmail,
  isValidPassword,
} = require("../validations/validator.js"); // Importing Validators

//-------------------------------[1st Api => Registering Admin]-----------------------------//

const registerAdmin = async function (req, res) {
  try {
    const body = req.body;
    let { fname, lname, email } = body;

    if (!isEmpty(body))
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty!" });

    if (!fname)
      return res
        .status(400)
        .send({ status: false, message: "fname is mandatory!" });
    if (!isValid(fname))
      return res
        .status(400)
        .send({ status: false, message: "The input string cannot be empty!" });
    fname = fname
      .split(" ")
      .filter((x) => x)
      .join(" ");

    if (!lname)
      return res
        .status(400)
        .send({ status: false, message: "lname is mandatory!" });
    if (!isValid(lname))
      return res
        .status(400)
        .send({ status: false, message: "The input string cannot be empty!" });
    lname = lname
      .split(" ")
      .filter((x) => x)
      .join(" ");

    if (!isValid(email))
      return res
        .status(400)
        .send({ status: false, message: "email is mandatory!" });

    if (!isValidEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "email is invalid!" });

    let duplicateEmail = await adminModel.findOne({ email });
    if (duplicateEmail)
      return res
        .status(409)
        .send({ status: false, message: `${email} is already registered!` });

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory!" });

    if (!isValidPassword(password))
      return res.status(400).send({
        status: false,
        message:
          "Password must be 8 to 15 characters and in alphabets and numbers only!",
      });

    //creating hash password by using bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    password = passwordHash;

    const create = await adminModel.create(body);
    return res.status(201).send({
      status: true,
      message: `Admin ${fname} is now registered!`,
      data: create,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//-------------------------------[2nd Api => Logging in a admin]-----------------------------//

const loginAdmin = async function (req, res) {
  try {
    let { email, password } = req.body;

    if (!isEmpty(req.body))
      return res
        .status(400)
        .send({ status: false, message: "Body cannot be empty!" });

    if (!isValid(email))
      return res
        .status(400)
        .send({ status: false, message: "email is mandatory!" });

    if (!isValidEmail(email))
      return res
        .status(400)
        .send({ status: false, message: "email is invalid!" });

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory!" });

    if (!isValidPassword(password))
      return res.status(400).send({
        status: false,
        message:
          "Password must be 8 to 15 characters and in alphabets and numbers only!",
      });

    let admin = await adminModel.findOne({ email: email });
    if (!admin)
      return res.status(404).send({
        status: false,
        message: `${email} is not present in the Database!`,
      });

    //password check by comparing request body password and the password from bcrypt hash password
    let passwordCheck = await bcrypt.compare(req.body.password, admin.password);
    //request body password and bcrypt hash password not match
    if (!passwordCheck)
      return res
        .status(400)
        .send({ status: false, message: "password is not correct!" });

    //Creating Token by jsonwebtoken
    let token = jwt.sign(
      {
        //Payload
        adminId: admin._id.toString(),
        company: "Functionup",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 480 * 60 * 60,
      },
      "backend_task1" // Secret Key
    );

    return res
      .status(201)
      .send({
        status: true,
        message: "Token created successfully!",
        data: { adminId: admin._id, token },
      });
  } catch (err) {
    console.log("This is the error:", err.message);
    return res.status(500).send({ status: false, message: err.message });
  }
};



// Destructuring & Exporting modules
module.exports = { registerAdmin, loginAdmin }  