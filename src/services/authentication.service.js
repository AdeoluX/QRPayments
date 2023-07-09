const httpStatus = require("http-status");
const { abortIf } = require("../utils/responder");
const providers = require("../providers");
const UserRepo = require("../database/dbServices/user.dbservice");
const AccountRepo = require("../database/dbServices/account.dbservice");
const {
  hash,
  compare_passwords,
  generate_random_password,
  unique_id,
} = require("../utils/passwordHash");
const { generateToken } = require("../utils/tokenManagement");
const { ObjectId } = require("mongodb");

class AuthenticationService {
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static signUp = async (data) => {
    const user_id = new ObjectId();
    const account_id = new ObjectId();
    const tx_ref = unique_id("ACCT");
    const {
      email,
      first_name,
      last_name,
      password,
      phonenumber,
      bvn,
      dob,
      confirm_password,
      user_type,
      rc_number,
    } = data;
    // verify bvn
    const bvnVerified = await providers["verifyme"].verifyBVN({ bvn, dob });
    abortIf(!bvnVerified, httpStatus.BAD_REQUEST, "Invalid BVN");
    abortIf(
      confirm_password !== password,
      httpStatus.BAD_REQUEST,
      "Passwords must match"
    );
    const findUser = await UserRepo.findOr([
      { email },
      { phonenumber },
      { bvn },
    ]);
    abortIf(
      findUser,
      httpStatus.BAD_REQUEST,
      "Phonenumber or Email already exists"
    );
    // account creation
    const {
      data: { account_number, bank_name, amount },
    } = await providers["flutterwave"].accountCreation({
      email,
      bvn,
      phonenumber,
      first_name,
      last_name,
      narration: `account for ${first_name}`,
      tx_ref,
    });
    const hash_password = await hash(password);
    const user = await UserRepo.create({
      email,
      first_name,
      last_name,
      password: hash_password,
      phonenumber,
      bvn,
      date_of_birth: new Date(dob),
      user_type,
      rc_number,
      _id: user_id,
      account: account_id,
    });

    const account = await AccountRepo.create({
      bank_code: "flutterwave",
      nuban: account_number,
      bank_name,
      balance: isNaN(amount) ? 0 : amount,
      user: user._id,
      _id: account_id,
      external_identifier: tx_ref,
    });

    console.log(account);
    const token = generateToken({
      user_id: user._id,
      email: user.email,
      first_name: user.first_name,
    });
    return { user, token };
  };
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static login = async ({ email, password }) => {
    let findUser = await UserRepo.find({ email });
    abortIf(!findUser, httpStatus.BAD_REQUEST, "Invalid credentials.");
    const check = await compare_passwords(password, findUser.password);
    abortIf(!check, httpStatus.BAD_REQUEST, "Invalid credentials.");
    const token = generateToken({
      user_id: findUser._id,
      email: findUser.email,
      first_name: findUser.first_name,
    });
    return { user: findUser, token };
  };
}

module.exports = AuthenticationService;
