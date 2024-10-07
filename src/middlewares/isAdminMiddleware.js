import ApiError from "../utils/ApiError.js";

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json(new ApiError(403, "Forbidden: Admins only"));
    }
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "IsAdmin failed", error.message));
  }
};

export default isAdmin;
