import * as mongoose from "mongoose";

const resetDb = async () => {
  await mongoose.connect(process.env.MONGODB_URL || "");
  await mongoose.connection.dropDatabase();
};

export default resetDb;
