const express = require("express");
const cors = require("cors");
const NotFoundError = require("./errors/not-found");
const userRouter = require("./routes/user.routes");
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/users", userRouter);

app.use((req, res, next) => {
  next(new NotFoundError());
});

// Middleware d'express pour gérer les erreurs
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;
  res.status(status);
  res.json({
    status,
    message,
  });
});

module.exports = { app }; //Anticipe le futur en exportant la constante app pour commencer dans un objet
