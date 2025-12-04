import { body, param, query, validationResult } from "express-validator";
import AppError from "../utils/appError.js";

export const createBookRules = [
  body("title")
    .notEmpty()
    .withMessage("Title tidak boleh kosong.")
    .trim()
    .escape(),

  body("author")
    .notEmpty()
    .withMessage("Penulis/author tidak boleh kosong.")
    .trim()
    .escape(),

  body("type").notEmpty().withMessage("Type buku tidak boleh kosong."),

  body("genreId")
    .notEmpty()
    .withMessage("Genre ID tidak boleh kosong.")
    .isInt()
    .withMessage("Genre ID harus berupa angka integer")
    .toInt(),

  body("year")
    .notEmpty()
    .withMessage("Tahun (year) tidak boleh kosong.")
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Tahun harus berupa angka antara 1000 dan ${new Date().getFullYear()}`
    )
    .toInt(),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stok harus berupa angka integer positif.")
    .toInt(),

  body("description").optional().trim().escape(),
];

export const paramRule = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Parameter harus berisi angka integer positif")
    .toInt(),
];

export const queryRule = [
  query("genreId")
    .optional()
    .isInt()
    .withMessage("Query genreId harus berupa angka.")
    .toInt(),

  query("type").optional().trim().escape(),

  query("search").optional().trim().escape(),
];

export const updateRule = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Judul (title) tidak boleh kosong.")
    .trim()
    .escape(),
  body("author")
    .optional()
    .notEmpty()
    .withMessage("Penulis (author) tidak boleh kosong.")
    .trim()
    .escape(),
  body("type")
    .optional()
    .notEmpty()
    .withMessage("Tipe (type) tidak boleh kosong."),
  body("genreId")
    .optional()
    .isInt()
    .withMessage("Genre ID harus berupa angka integer.")
    .toInt(),
  body("year")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Tahun harus berupa angka antara 1000 dan ${new Date().getFullYear()}`
    )
    .toInt(),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stok harus berupa angka integer positif.")
    .toInt(),
  body("description").optional().trim().escape(),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return next(
    new AppError("Data yang dikirim tidak valid.", 422, {
      errors: extractedErrors,
    })
  );
};
