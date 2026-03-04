const NotFoundError = require("../errors/not-found");
const UnauthorizedError = require("../errors/unauthorized");
const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");
const config = require("../config/index");

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async getUserByID(req, res, next) {
    try {
      const id = req.params.id;
      const user = await userService.get(id);
      if (!user) {
        throw new NotFoundError();
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      req.body.role = "user";
      const user = await userService.create(req.body);
      user.password = undefined;
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const userUpdated = await userService.update(id, data);
      res.json(userUpdated);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const id = req.params.id;
      await userService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userService.checkPasswordUser(email, password);
      if (!user) {
        throw new UnauthorizedError();
      }
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        config.secretJwtToken,
        {
          expiresIn: "3d",
        },
      );
      res.json({
        token,
      });
      console.log("token :", token);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
