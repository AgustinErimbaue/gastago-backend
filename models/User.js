const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true, // también debería ser único
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    password: { type: String, required: true, minlength: 6 },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    tokens: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
