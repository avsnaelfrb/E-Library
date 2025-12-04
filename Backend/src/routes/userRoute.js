import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  editPhotoProfile,
} from "../controllers/userController.js";
import {
  loginRules,
  paramRule,
  registerRules,
  validate,
} from "../validators/userValidator.js";
import upload from "../config/multerConfig.js";
import { handleFilePaths } from "../middleware/checkFile.js";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      status: "fail",
      message: "Terlalu banyak percobaan login/register. Silahkan coba lagi dalam 15 menit."
    });
  }
})

router.post("/register", authLimiter, registerRules, validate, register);
router.post("/login", authLimiter, loginRules, validate, login);
router.put(
  "/photo-profile/:id",
  verifyToken,
  paramRule,
  upload.single("photoProfile"),
  validate,
  handleFilePaths,
  editPhotoProfile
);

export default router;
