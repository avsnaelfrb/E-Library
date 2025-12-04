import { body, param, validationResult } from "express-validator";
import AppError from "../utils/appError.js";

export const registerRules = [
  body("name").notEmpty().withMessage("Nama wajib diisi").trim().escape(),
  body("email")
    .isEmail()
    .withMessage("Format email tidak valid")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  body("nim").notEmpty().withMessage("NIM wajib diisi").isString().trim().escape(),
];

export const loginRules = [
  body("email").isEmail().withMessage("Format email tidak valid"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
];

export const paramRule = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Parameter harus berisi angka integer positif")
    .toInt(),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return next(new AppError("Validasi Gagal", 422, { errors: extractedErrors }));
};

