import { body, param, validationResult } from "express-validator";
import AppError from "../utils/appError.js";

export const genreIdParamRule = [
  param("id")
    .notEmpty()
    .withMessage("ID genre tidak boleh kosong")
    .isInt({ min: 1 })
    .withMessage("ID genre harus berupa angka integer positif")
    .toInt(), 
];

export const genreBodyRules = [
  body("name")
    .notEmpty()
    .withMessage("Nama genre tidak boleh kosong")
    .trim()
    .escape() 
    .isLength({ min: 3 })
    .withMessage("Nama genre minimal 3 karakter"),
];

export const updateGenreBodyRules = [
  body("name")
    .optional() 
    .trim()
    .escape()
    .isLength({ min: 3 })
    .withMessage("Nama genre minimal 3 karakter"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return next(
    new AppError("Data genre tidak valid", 422, { errors: extractedErrors })
  );
};
