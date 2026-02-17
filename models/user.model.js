const { model, Schema } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = Schema({
  name: String,
  password: {
    type: String,
    required: [true, "Mot de passe obligatoire"],
    minlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
      message: (props) => `${props.value} n'est pas valide`,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    // enum: ["admin", "user", "pro"],
    enum: {
      values: ["admin", "user", "pro"],
      message: "{VALUE} inconnue",
    },
  },
});

// Middleware Mongoose avec utilisation du next
/* userSchema.pre("save", (next) => {
  next();
}); */

/* userSchema.post("save", function () {
  if (!this.email) {
    const error = new Error("message");
    next(error);
  }
}); */

userSchema.pre("save", async function () {
  this.email = this.email.toLowerCase();
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = model("User", userSchema);
