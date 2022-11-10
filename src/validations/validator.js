const mongoose = require("mongoose");

//-------------------------------------------------------[Validators]---------------------------------------------------------------------//

const isValidObjectId = (objectId) => {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "object" && Object.keys(value).length === 0)
    return false;
  return true;
};

const isEmpty = (value) => {
  if (Object.keys(value).length === 0) return false;
  return true;
};

const isNumber = (value) => {
  if (typeof value !== "number") return false;
  else return true;
};

const isValidEmail = (value) => {
  let isValidEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/;
  if (isValidEmail.test(value)) return true;
};

const isValidPassword = (value) => {
  let isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
  if (isValidPassword.test(value)) return true;
};

module.exports = {
  isValidObjectId,
  isValid,
  isEmpty,
  isNumber,
  isValidEmail,
  isValidPassword,
}; // Exporting them
