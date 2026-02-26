const User = require("../models/user.model");
const bcrypt = require("bcrypt");

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

  async checkPasswordUser(email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return false;
    }
    const mdpCompare = await bcrypt.compare(password, user.password);
    if (!mdpCompare) {
      return false;
    }
    return user._id;
  }
}

module.exports = new UserService();
