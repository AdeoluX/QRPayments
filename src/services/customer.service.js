const httpStatus = require("http-status");
const { abortIf } = require("../utils/responder");
const providers = require("../providers");
const StoreRepo = require("../database/dbServices/store.dbservice");
const UserRepo = require("../database/dbServices/user.dbservice")
const StoreItemRepo = require("../database/dbServices/storeItems.dbservice");
const AccountRepo = require("../database/dbServices/account.dbservice")
const TransRepo = require("../database/dbServices/transaction.dbservice")
const {
  hash,
  compare_passwords,
  generate_random_password,
  unique_id,
} = require("../utils/passwordHash");
const { generateToken } = require("../utils/tokenManagement");
const { ObjectId } = require("mongodb");

class CustomerService {
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static getCustomerDetails = async (data) => {};
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static getStore = async (auth) => {
    const { user_id } = auth;
    const findStore = await StoreRepo.find({ user: user_id });
    return findStore;
  };
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static createStore = async (data) => {
    const {
      auth: { user_id, email },
      body: { name, rc_number },
    } = data;
    // does store exist
    const findStore = await StoreRepo.find({ rc_number });
    abortIf(findStore, httpStatus.BAD_REQUEST, "RC already used");
    const verifyRC = await providers["verifyme"].verifyRCnumber();
    // verify rc_number
    abortIf(!verifyRC.status, httpStatus.BAD_REQUEST, "Invalid RC number");
    //create store
    const store = await StoreRepo.create({
      store_name: name,
      rc_number,
      user: user_id,
    });
    return store;
  };
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static getAccountDetails = async ({user_id}) => {
    const accountDetails = await AccountRepo.find({user: user_id})
    return accountDetails;
  };
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static getTransactions = async ({ user_id }) => {
    const list = await TransRepo.findAll({user: user_id, status: "success"})
    return list
  };
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static getStoreItems = async ({ email, password }) => {};
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static getOneStoreItem = async ({ email, password }) => {};
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static uploadStoreItems = async ({
    auth: { user_id },
    store_id,
    body: { name, quantity, category, price, description, currency },
  }) => {
    // find store
    const store = await StoreRepo.find({ _id: store_id, user: user_id });
    abortIf(!store, httpStatus.NOT_FOUND, "Invalid store");
    const storeItem = await StoreItemRepo.create({
      name,
      quantity,
      category,
      price,
      description,
      currency,
      store: store._id,
    });
    store.items.push(storeItem._id);
    store.save();
    return storeItem;
  };
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static updateStoreItem = async ({ email, password }) => {};
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static storeAnalytics = async ({ email, password }) => {};

  static setTransferLimits = async ({ user_id, password, limit }) => {
    const user = await UserRepo.find({_id: user_id})
    abortIf(!user, httpStatus.BAD_REQUEST, 'User does not exist.');
    const check = await compare_passwords(password, user.password);
    abortIf(!check, httpStatus.BAD_REQUEST, "Invalid credentials.");
    await UserRepo.update({transfer_limit: limit})
    return {message: 'Updated successfully'}
  };

  static setTransactionPin = async ({ user_id, password, pin }) => {
    const user = await UserRepo.find({_id: user_id})
    abortIf(!user, httpStatus.BAD_REQUEST, 'User does not exist.');
    const check = await compare_passwords(password, user.password);
    abortIf(!check, httpStatus.BAD_REQUEST, "Invalid credentials.");
    const hash_pin = await hash(pin);
    await UserRepo.update({pin: hash_pin})
    return {message: 'Updated successfully'}
  };
}

module.exports = CustomerService;
