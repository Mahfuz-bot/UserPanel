import { NODE_ENV, REFRESH_TOKEN_SECRET, ADMIN_SECRET } from "../config.js";
import User from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, adminSecret } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res
        .status(400)
        .json(new ApiError(400, "Email already in use", {}));
    }

    const role = adminSecret === ADMIN_SECRET ? "admin" : "user";

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "SignUp Successfully", user));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "SignUp controller did not work", error.message));
  }
};

const generateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Token generation failed", error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json(new ApiError(400, "All fields are required"));
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json(new ApiError(400, "Email did not exist"));
    const isMatch = await user.isPassCorrect(password);
    if (!isMatch)
      return res.status(401).json(new ApiError(401, "Password did not match"));

    const { accessToken, refreshToken } = await generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const options = {
      httpOnly: true,
      sameSite: "Strict",
      secure: NODE_ENV === "production",
    };

    return res
      .status(202)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(202, "Login Successfully", refreshToken));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Login controller did not work", error.message));
  }
};

export const logout = async (req, res) => {
  try {
    const user = req.user;
    await User.findByIdAndUpdate(user._id, { $set: { refreshToken: null } });
    const options = {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "Strict",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "Logout Successfully", {}));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Logout controller failed", error.message));
  }
};

export const updateTokens = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res.status(404).json(new ApiError(404, "Token not found"));
    const decodedToken = await jwt.verify(token, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);

    if (!user) return res.status(404).json(new ApiError(404, "Invalid token"));
    if (user.refreshToken !== token)
      return res.status(401).json(new ApiError(401, "Token expired"));

    const { accessToken, refreshToken } = await generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      sameSite: "Strict",
      secure: NODE_ENV === "production",
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Token updated successfully", {
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Update tokens failed", error.message));
  }
};

export const updateAccDetails = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email)
      return res.status(403).json(new ApiError(403, "All fields are required"));
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          firstName,
          lastName,
          email,
        },
      },
      { new: true }
    ).select({ password: 0 });
    return res
      .status(200)
      .json(new ApiResponse(200, "Updated successfully", user));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "UpdateAccDetails failed", error.message));
  }
};

export const changePass = async (req, res) => {
  try {
    const { password, newPass } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }
    const isMatch = await user.isPassCorrect(password);

    if (isMatch)
      return res
        .status(200)
        .json(new ApiResponse(200, "Password match", isMatch));

    if (await bcrypt.compare(newPass, user.password))
      return res
        .status(400)
        .json(new ApiError(400, "New pass can not be the old one"));

    user.password = newPass;
    await user.save();
    return res
      .status(200)
      .json(new ApiResponse(200, "Password change successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "ChangePass failed", error.message));
  }
};

export const getCurrUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id, { password: 0 });
    if (!user) return res.status(404).json(new ApiError(404, "User not found"));

    return res
      .status(200)
      .json(new ApiResponse(200, "Fetched user successfully", user));
  } catch (error) {
    error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Get User failed", error.message));
  }
};
