const { app } = require("./server");
const config = require("./config");

const mongoose = require("mongoose");

mongoose
  .connect(config.mongoURI)
  .then(() => console.log("Mongoose connecté"))
  .catch((err) => console.error("Erreur MongoDB : ", err));

app.listen(config.port, () => {
  console.log(
    `Le micro-service d'authentification est bien démarré sur le port ${config.port}`,
  );
});
