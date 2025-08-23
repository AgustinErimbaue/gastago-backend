const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserCOntroller");

router.post("/", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
