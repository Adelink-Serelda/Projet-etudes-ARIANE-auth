const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "No Token";
    }
    const decodedToken = jwt.verify(token, config.secretJwtToken);
    req.user = decodedToken;
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
