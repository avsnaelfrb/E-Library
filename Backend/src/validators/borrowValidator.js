import { param, validationResult } from "express-validator";
import AppError from "../utils/appError.js";

export const borrowBookRules = [
  param("bookId")
    .notEmpty()
    .withMessage("ID Buku tidak boleh kosong")
    .isInt({ min: 1 })
    .withMessage("ID Buku harus berupa angka valid")
    .toInt(), 
];

export const returnBookRules = [
  param("borrowId")
    .notEmpty()
    .withMessage("ID Peminjaman tidak boleh kosong")
    .isInt({ min: 1 })
    .withMessage("ID Peminjaman harus berupa angka valid")
    .toInt(),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return next(
    new AppError("Data tidak valid", 422, { errors: extractedErrors })
  );
};
