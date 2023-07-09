const bcrypt = require("bcryptjs");
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()><?/"][}{|+=-_`~:;';
const alphaNumeric =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const generate_random_password = (number = 8) => {
  let result = "";
  const charactersLength = characters.length;
  for (var i = 0; i < number; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const alpha_numeric_random = (number = 8) => {
  let result = "";
  const charactersLength = alphaNumeric.length;
  for (var i = 0; i < number; i++) {
    result += alphaNumeric.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const numbers = "1234567890";

const generate_cscs_refcode = (number = 8) => {
  let result = "";
  const charactersLength = numbers.length;
  for (var i = 0; i < number; i++) {
    result += numbers.charAt(Math.floor(Math.random() * charactersLength));
  }
  return Number(result);
};

const axia_unique = () => {
  let result = "IN";
  const charactersLength = characters.length;
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const unique_id = (tenant_name) => {
  let result = tenant_name + "_";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < 17; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const hash = async (text) => {
  const salt = await bcrypt.genSaltSync(10);
  const hashed_password = await bcrypt.hashSync(text, salt);
  return hashed_password;
};

const compare_passwords = async (incoming_password, password_on_db) => {
  const check = await bcrypt.compare(incoming_password, password_on_db);
  return check;
};

module.exports = {
  generate_random_password,
  hash,
  compare_passwords,
  unique_id,
  axia_unique,
  generate_cscs_refcode,
  alpha_numeric_random,
};
