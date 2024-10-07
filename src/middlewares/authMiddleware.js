import { ACCESS_TOKEN_SECRET } from "../config.js";
import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(404).json(new ApiError(404, "Token not found", {}));
    const decodedToken = await jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id, {
      password: 0,
      refreshToken: 0,
    });

    if (!user)
      return res
        .status(401)
        .json(new ApiError(401, "Access denied. Token did not match"));

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Auth failed", error.message));
  }
};

export default verifyJWT;
