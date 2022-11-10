const jwt = require("jsonwebtoken");
const adminModel = require("../models/adminModel.js");
const { isValidObjectId } = require("../validations/validator.js");

//-------------------------------------------------------[Authentication]---------------------------------------------------------------------\\

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token)
      return res.send({ status: false, message: "token must be present" });
    jwt.verify(token, "backend_task1", function (err, decoded) {
      if (err) {
        return res.status(401).send({ status: false, message: err.message });
      } else {
        console.log(decoded);
        req.decodedToken = decoded;
        next();
      }
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//-------------------------------------------------------[Authorisation]---------------------------------------------------------------------\\

const authorisation = async function (req, res, next) {
  try {
    const decodedToken = req.decodedToken;
    const adminId = req.params.adminId;

    if (!adminId) {
      return res.status(400).send({
        status: false,
        message: "AdminId is required in the request paramaters!",
      });
    }
    if (!isValidObjectId(adminId)) {
      return res
        .status(401)
        .send({ status: false, message: "AdminId is invalid!" });
    }
    const adminFound = await adminModel.findOne({ _id: adminId });
    if (!adminFound) {
      return res
        .status(404)
        .send({ status: false, message: `${adminId} does not exists!` });
    }
    if (decodedToken.adminId != adminId) {
      return res.status(403).send({
        status: false,
        message: "You are unauthorised to perform this action!",
      });
    }
    next();
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { authentication, authorisation }; // Exporting the middlwares
