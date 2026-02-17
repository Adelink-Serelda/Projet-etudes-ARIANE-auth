class NotFoundError extends Error {
  status = 404;
  constructor(message = "not found") {
    super(message);
  }
}

module.exports = NotFoundError;
