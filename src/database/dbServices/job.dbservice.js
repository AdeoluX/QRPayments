// const { options } = require('../../app');
const Model = require("../models/Jobs");

class ModelRepo {
  create = async (data) => {
    const account = await (
      await new Model(data).save()
    ).populate({
      path: "creator",
      model: "User",
      select: "firstname lastname",
    });
    return account;
  };

  find = async (condition) => {
    const account = await Model.findOne(condition).populate("users").exec();
    return account;
  };

  findAll = async (condition) => {
    const account = await Model.find(condition).populate("todo").exec();
    return account;
  };

  update = async (new_values, condition) => {
    const account = await Model.findOneAndUpdate(condition, new_values, {
      new: true,
    });
    return account;
  };

  delete = async (condition) => {
    const account = await Model.deleteOne(condition);
    return account;
  };
}

module.exports = {
  ModelRepo,
};
