import mongoose from "mongoose";
import { MONGODB_URI, PORT } from "../config.js";
import app from "../app.js";
import ApiError from "../utils/ApiError.js";

const dbName = "betaTest";

async function connectWithError() {
  try {
    await mongoose.connect(`${MONGODB_URI}/${dbName}`);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw new ApiError(500, "MongoDB not connected", err.message);
  }
}

export default connectWithError;
