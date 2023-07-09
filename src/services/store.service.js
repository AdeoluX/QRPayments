const httpStatus = require("http-status");
const { abortIf } = require("../utils/responder");
const providers = require("../providers");
const StoreRepo = require("../database/dbServices/store.dbservice");
const StoreItemRepo = require("../database/dbServices/storeItems.dbservice");
const {
  hash,
  compare_passwords,
  generate_random_password,
  unique_id,
} = require("../utils/passwordHash");
const { generateToken } = require("../utils/tokenManagement");
const { ObjectId } = require("mongodb");

class StoreService {
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static getOneStore = async ({ store_id }) => {
    const store = await StoreRepo.find({
      _id: store_id,
    });
    return store;
  };
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static getAllStore = async (data) => {};
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static searchStoresByItems = async (data) => {
    const { filter, startPrice, endPrice, currency } = data;
    const filterItem = StoreItemRepo.findAll({
      price: { $lte: endPrice || 1000000000, $gte: startPrice || 0 },
      currency: currency || "NGN",
      $or: [
        { name: { $regex: ".*" + filter + ".*" } },
        { description: { $regex: ".*" + filter + ".*" } },
      ],
    });
    return filterItem;
  };
}

module.exports = StoreService;
