const httpStatus = require("http-status");
const { abortIf } = require("../utils/responder");
const providers = require("../providers");
const StoreRepo = require("../database/dbServices/store.dbservice");
const StoreItemRepo = require("../database/dbServices/storeItems.dbservice");
const TransactionRepo = require("../database/dbServices/transaction.dbservice");
const AccountRepo = require("../database/dbServices/account.dbservice");
const {
  hash,
  compare_passwords,
  generate_random_password,
  unique_id,
  alpha_numeric_random,
} = require("../utils/passwordHash");
const { generateToken } = require("../utils/tokenManagement");
const { ObjectId } = require("mongodb");
const { conn } = require("../database/db.connections");

class PaymentService {
  /**
   * Service to the list african urban areas
   * @returns {(string|Array)}
   */
  static generateQRHash = async (data) => {
    try {
      const {
        auth: { user_id },
        amount,
        description,
        module = "QR",
        currency,
        type = "CR",
        store = null,
      } = data;
      const qr_hash = `trf_${alpha_numeric_random(17)}`;
      await TransactionRepo.create({
        amount,
        description,
        user: user_id,
        module,
        currency,
        type,
        qr_hash,
        status: "pending",
        store,
        reference: `REF_${alpha_numeric_random(17)}`,
      });
      return {
        qr_hash,
      };
    } catch (error) {
      // await session.abortTransaction();
    }
    // session.endSession();
  };

  static scanQR = async (hash) => {
    // find hash
    const findHash = await TransactionRepo.find({
      qr_hash: hash,
      status: "pending",
    });
    abortIf(!findHash, httpStatus.BAD_REQUEST, "Invalid QR code.");
    const {
      _id,
      amount,
      currency,
      description,
      user: { first_name, last_name },
    } = findHash;
    return {
      transaction_id: _id,
      amount,
      currency,
      description,
      receipient: `${first_name} ${last_name}`,
    };
  };

  static initiateTransaction = async ({ auth, transaction_id }) => {
    const { user_id } = auth;
    // find transactions
    const { user: receiver_id } = await this.logTransactions(transaction_id);
    // intiate transfer between users
    // ==> Get Users Accounts
    const { payer_bank_id, receiver_bank_id } = await this.getAccountIds({
      receiver_id,
      payer_id: user_id,
    });
  };

  static logTransactions = async (transaction_id) => {
    const transactions = await TransactionRepo.find({ _id: transaction_id });
    abortIf(!transactions, httpStatus.BAD_REQUEST, "Invalid reference.");
    const transactionsMeta = {
      payers_id: user_id,
      ...(transactions.qr_hash && { type: "QR" }),
    };
    const newTransactionMeta = {
      receiver_id: user_id,
      ...(transactions.qr_hash && { type: "QR" }),
    };
    const {
      amount,
      description,
      module,
      currency,
      qr_hash,
      store,
      reference,
      user,
    } = transactions;
    const newTransactionsLog = await TransactionRepo.create({
      amount,
      description,
      user: user_id,
      module,
      currency,
      type: "DR",
      qr_hash,
      status: "processing",
      store,
      reference,
      meta: JSON.stringify(newTransactionMeta),
    });
    // update oldTransactions
    await TransactionRepo.update(
      { meta: JSON.stringify(transactionsMeta) },
      { _id: transaction_id }
    );

    return { user };
  };

  static getAccountIds = async ({ receiver_id, payer_id }) => {
    const { external_identifier: receiver_bank_id } = await AccountRepo.find({
      user: receiver_id,
    });
    const { external_identifier: payer_bank_id } = await AccountRepo.find({
      user: payer_id,
    });

    return { receiver_bank_id, payer_bank_id };
  };
}

module.exports = PaymentService;
