const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/keys");
const bcrypt = require("bcryptjs");

const UserController = {
  async register(req, res) {
    try {
      const { email, password, username } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .send({ msg: "Email y contraseña son obligatorios" });
      }
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(409).send({ msg: "El email ya está registrado" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await User.create({
        email,
        password: hashedPassword,
        username,
      });
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      user.tokens = [token];
      await user.save();
      res
        .status(201)
        .send({
          msg: "Usuario registrado correctamente",
          user: { _id: user._id, email: user.email, username: user.username },
          token,
        });
    } catch (error) {
      if (error.username === "ValidationError") {
        return res
          .status(400)
          .send({ msg: "Datos inválidos", error: error.message });
      }
      console.error(error);
      res.status(500).send({ msg: "Error en el servidor" });
    }
  },
  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email });
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: "Bienvenid@ " + user.username, token });
    } catch (error) {
      console.error(error);
    }
  },
  async getUserInfo(req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      res.send(user);
    } catch (error) {
      res.status(500).send({ message: "Error en el servidor" });
    }
  },
};
module.exports = UserController;
