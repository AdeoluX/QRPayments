const httpStatus = require("http-status");
const { abortIf } = require("../utils/responder");
const providers = require("../providers");
const StoreRepo = require("../database/dbServices/store.dbservice");
const StoreItemRepo = require("../database/dbServices/storeItems.dbservice");
const TransactionRepo = require("../database/dbServices/transaction.dbservice");
const AccountRepo = require("../database/dbServices/account.dbservice");
const mongoose = require("mongoose");
const {
  hash,
  compare_passwords,
  generate_random_password,
  unique_id,
  alpha_numeric_random,
  generate_cscs_refcode,
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

  static scanQR = async (hash, auth) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { user_id } = auth;
      console.log(hash, auth);
      // find hash
      const findHash = await TransactionRepo.findAll({
        qr_hash: hash,
        $or: [{ status: "pending" }, { status: "processing" }],
      });
      //
      const specificHash = await TransactionRepo.find({
        qr_hash: hash,
        user: user_id,
        $or: [{ status: "pending" }, { status: "processing" }],
      });
      abortIf(
        findHash.length < 1 || (findHash.length > 1 && !specificHash),
        httpStatus.BAD_REQUEST,
        "Invalid QR code."
      );
      const transactionsMeta = {
        payers_id: user_id,
        ...(findHash.qr_hash && { type: "QR" }),
      };
      await TransactionRepo.update(
        { meta: JSON.stringify(transactionsMeta) },
        { qr_hash: hash, type: "CR" }
      );
      const newTransactionMeta = {
        receiver_id: user_id,
        ...(findHash.qr_hash && { type: "QR" }),
      };
      const newTransactionsLog = await TransactionRepo.create({
        amount: findHash[0].amount,
        description: findHash[0].description,
        user: user_id,
        module: findHash[0].module,
        currency: findHash[0].currency,
        type: "DR",
        qr_hash: findHash[0].qr_hash,
        status: "pending",
        store: findHash[0].store,
        reference: findHash[0].reference,
        meta: JSON.stringify(newTransactionMeta),
      });
      console.log(findHash[0]);
      const {
        _id,
        amount,
        currency,
        description,
        user: { first_name, last_name },
      } = findHash[0];
      session.commitTransaction();
      return {
        transaction_id: _id,
        amount,
        currency,
        description,
        receipient: `${first_name} ${last_name}`,
      };
    } catch (error) {
      session.abortTransaction();
      abortIf(error, httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!");
    } finally {
      session.endSession();
    }
  };

  static initiateTransaction = async ({ auth, qr_hash: transaction_id }) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { user_id } = auth;
      // find transaction
      const trxn = await TransactionRepo.find({ _id: transaction_id });
      // find transactions
      const [transaction1, transaction2] = await TransactionRepo.findAll({
        qr_hash: trxn.qr_hash,
      });

      let amount = transaction1.amount;
      let reference = transaction1.reference;
      let receiver_id;
      if (transaction1.type === "CR") {
        receiver_id = transaction1.user;
      }
      if (transaction2.type === "CR") {
        receiver_id = transaction2.user;
      }
      // intiate transfer between users
      // ==> Get Users Accounts
      const { payer_bank_id, receiver_bank_id } = await this.getAccountIds({
        receiver_id,
        payer_id: user_id,
      });
      // get balance
      const account = await AccountRepo.find({ _id: payer_bank_id });
      abortIf(
        amount > account.balance,
        httpStatus.BAD_REQUEST,
        "Insufficient Funds"
      );
      // decrease and increase accounts accordingly
      await AccountRepo.update(
        { $inc: { balance: amount } },
        { _id: receiver_bank_id },
        session
      );
      await AccountRepo.update(
        { $inc: { balance: -amount } },
        { _id: payer_bank_id },
        session
      );
      await TransactionRepo.updateAll(
        { status: "success" },
        { reference },
        session
      );
      session.commitTransaction();
      return {
        message: "success",
      };
    } catch (error) {
      session.abortTransaction();
      abortIf(error, httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!");
    } finally {
      session.endSession();
    }
  };

  static logTransactions = async (transaction_id) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
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
      const newTransactionsLog = await TransactionRepo.create(
        {
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
        },
        session
      );
      // update oldTransactions
      await TransactionRepo.update(
        { meta: JSON.stringify(transactionsMeta) },
        { _id: transaction_id },
        session
      );
      session.commitTransaction();
      return { user, amount, qr_hash, reference };
    } catch (error) {
      session.abortTransaction();
      abortIf(error, httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!");
    } finally {
      session.endSession();
    }
  };

  static getAccountIds = async ({ receiver_id, payer_id }) => {
    const { _id: receiver_bank_id } = await AccountRepo.find({
      user: receiver_id,
    });
    const { _id: payer_bank_id } = await AccountRepo.find({
      user: payer_id,
    });

    return { receiver_bank_id, payer_bank_id };
  };

  static initiate = async ({
    auth: { user_id, email },
    payload: { amount, currency },
    action,
  }) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const tx_ref = `FUNWAL_${alpha_numeric_random(19)}`;
      const transactionLog = await TransactionRepo.create(
        {
          amount,
          description: action,
          user: user_id,
          module: "CARD",
          currency,
          type: "CR",
          status: "processing",
          reference: tx_ref,
        },
        session
      );
      const call = await providers["flutterwave"].initiate({
        tx_ref,
        amount,
        redirect_url:
          "https://qrpayments-production.up.railway.app/api/v1/pay/callback",
        currency,
        email,
        meta: {
          action,
          user_id,
          reference: tx_ref,
          currency,
        },
      });
      session.commitTransaction();
      return call.data;
    } catch (error) {
      console.log(error.message);
      session.abortTransaction();
      abortIf(error, httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!");
    } finally {
      session.endSession();
    }
  };

  static processCallback = async ({
    query: { status: txn_status, tx_ref },
  }) => {
    const session = mongoose.startSession();
    (await session).startTransaction();
    try {
      const { user, amount, status } = await TransactionRepo.find({
        reference: tx_ref,
      });
      if (["pending", "processing"].includes(status)) {
        const updateTransaction = await TransactionRepo.update(
          {
            status: "success",
          },
          { reference: tx_ref }
        );
        const accountUpdate = await AccountRepo.update(
          {
            $inc: { balance: amount },
          },
          { user }
        );
      }
      return {};
    } catch (error) {
      (await session).abortTransaction();
      abortIf(error, httpStatus.INTERNAL_SERVER_ERROR, "Something went wrong!");
    } finally {
      (await session).endSession();
    }
  };
}

module.exports = PaymentService;
