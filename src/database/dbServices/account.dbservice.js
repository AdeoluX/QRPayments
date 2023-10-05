// const { options } = require('../../app');
const Model = require("../models/Account");

class ModelRepo {
  static create = async (data, transaction = null) => {
    const account = await new Model(data).save({...(transaction && {session: transaction})});
    return account;
  };

  static find = async (condition) => {
    const account = await Model.findOne(condition).populate("user").exec();
    return account;
  };

  static findAll = async (condition) => {
    const account = await Model.find(condition).populate("user").exec();
    return account;
  };

  static update = async (new_values, condition, transaction = null) => {
    const account = await Model.findOneAndUpdate(condition, new_values, {
      new: true,
      ...(transaction && {session: transaction})
    });
    return account;
  };

  static delete = async (condition, transaction = null) => {
    const account = await Model.deleteOne(condition, {...(transaction && {session: transaction})});
    return account;
  };
}

module.exports = ModelRepo;
