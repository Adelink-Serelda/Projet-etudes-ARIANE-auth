const User = require("../models/user.model");

class UserService {
  getAll() {
    return User.find({}, "-password");
  }

  get(id) {
    return User.findById(id, "-password");
  }

  create(data) {
    const user = new User(data);
    return user.save();
  }

  update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true }); // New: true renvoie au client l'user modifié
  }

  delete(id) {
    return User.deleteOne({ _id: id });
  }
}

module.exports = new UserService();
