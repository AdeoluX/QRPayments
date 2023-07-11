const httpStatus = require("http-status");
const { generate_random_password } = require("../utils/passwordHash");
const { Request } = require("../utils/ApiCall");
const { abortIf } = require("../utils/responder");

class FlutterwaveService {
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static accountCreation = async ({
    email,
    bvn,
    phonenumber,
    first_name,
    last_name,
    narration,
    tx_ref,
  }) => {
    const payload = {
      email,
      bvn,
      phonenumber,
      firstname: first_name,
      lastname: last_name,
      narration,
      tx_ref,
      is_permanent: true,
    };
    const call = await Request.axiosPOST(
      `${process.env.FLUTTERWAVE_BASEURL}/v3/virtual-account-numbers`,
      payload,
      {
        headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_TOKEN}` },
      }
    );
    return call.data;
  };
  /**
   * Service to the getDetails Controller
   * @returns {object}
   */
  static fundTransfer = async ({ email, password }) => {
    return {};
  };

  static initiate = async ({
    tx_ref,
    amount,
    redirect_url,
    email,
    meta,
    currency,
  }) => {
    const payload = {
      tx_ref,
      amount,
      redirect_url,
      customer: {
        email,
      },
      meta,
      currency,
      payment_options: "card",
    };
    const call = await Request.axiosPOST(
      `${process.env.FLUTTERWAVE_BASEURL}/v3/payments`,
      payload,
      {
        headers: { Authorization: `Bearer ${process.env.FLUTTERWAVE_TOKEN}` },
      }
    );
    return call.data;
  };
}

module.exports = FlutterwaveService;
