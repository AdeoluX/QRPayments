// const { options } = require('../../app');
const Model = require("../models/Transactions");

class ModelRepo {
  static create = async (data) => {
    const account = await new Model(data).save();
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

  static update = async (new_values, condition) => {
    const account = await Model.findOneAndUpdate(condition, new_values, {
      new: true,
    });
    return account;
  };

  static updateAll = async (new_values, condition) => {
    const account = await Model.updateMany(condition, new_values, {
      new: true,
    });
    return account;
  };

  static delete = async (condition) => {
    const account = await Model.deleteOne(condition);
    return account;
  };
}

module.exports = ModelRepo;
