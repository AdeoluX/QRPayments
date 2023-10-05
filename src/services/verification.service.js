const httpStatus = require("http-status");
const { abortIf } = require("../utils/responder");
const providers = require("../providers");
const UserRepo = require("../database/dbServices/user.dbservice");

class VerificationService {
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static verifyNuban = async ({ user_id, data }) => {
    const findUser = await UserRepo.find({ _id: user_id });
    const { first_name, last_name } = findUser;
    const {
      data: { accessToken },
      success,
    } = await providers["verifyme"].login();
    abortIf(!success, httpStatus.FAILED_DEPENDENCY, "Failed to verify nuban");
    const verify = await providers["verifyme"].nubanVerification({
      ...data,
      first_name,
      last_name,
      login_token: accessToken,
    });
    abortIf(
      !verify.success || verify?.data?.status?.status !== "verified",
      httpStatus.FAILED_DEPENDENCY,
      verify?.status?.status !== "verified"
        ? "Nuban mismatch"
        : "Failed to verify nuban"
    );
    const userUpdate = await UserRepo.update(
      {
        date_of_birth: data.dob,
        phonenumber: data.phone,
        activated: true,
        bvn: verify.data.nuban.bvn,
      },
      { _id: user_id }
    );
    return {
      ...verify.data?.applicant,
    };
  };
}

module.exports = VerificationService;
