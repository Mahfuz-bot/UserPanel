import cookieParser from "cookie-parser";
import express from "express";
import userRoute from "./routes/userRoute.js";
import cors from "cors";

const app = express();

// Essential middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/user", userRoute);

export default app;
