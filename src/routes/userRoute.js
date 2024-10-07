import express from "express";
import {
  changePass,
  getCurrUser,
  login,
  logout,
  signup,
  updateAccDetails,
  updateTokens,
} from "../controllers/userController.js";
import verifyJWT from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/update-tokens").post(updateTokens);
router.route("/update-acc-details").put(verifyJWT, updateAccDetails);
router.route("/update-pass").post(verifyJWT, changePass);
router.route("/get-user").get(verifyJWT, getCurrUser);

export default router;
