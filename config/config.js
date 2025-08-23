const mongoose = require("mongoose");
const { MONGO_URI } = require("./keys");

const dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("base de datos coconectada correctamente");
  } catch (error) {
    console.log(error);
    throw new Error("Error al conectarse a la base de datos");
  }
};

module.exports = {
  dbConnection,
};
