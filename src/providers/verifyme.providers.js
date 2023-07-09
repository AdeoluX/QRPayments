const httpStatus = require("http-status");
const { abortIf } = require("../utils/responder");

class VerifyMeService {
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static verifyBVN = async ({ bvn, dob }) => {
    return {
      status: true,
    };
  };
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static verifyNIN = async ({ email, password }) => {
    return {};
  };
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static verifyRCnumber = async (data) => {
    return {
      status: true,
    };
  };
}

module.exports = VerifyMeService;
