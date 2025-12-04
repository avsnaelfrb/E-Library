import express from "express";
//controller
import {
  createBook,
  deleteBook,
  getAllBook,
  getBookById,
  updateBook,
} from "../controllers/bookController.js";

import { verifyToken, isAdmin } from "../middleware/middleware.js";
import upload from "../config/multerConfig.js";
import { handleFilePaths } from "../middleware/checkFile.js";

//validator
import {
  createBookRules,
  paramRule,
  queryRule,
  updateRule,
  validate,
} from "../validators/bookValidator.js";

const route = express.Router();

//CREATE Book
route.post(
  "/",
  verifyToken,
  isAdmin,
  upload.fields([
    {
      name: "cover",
      maxCount: 1
    },
    {
      name: 'bookFile',
      maxCount: 1
    }
  ]
  ),
  createBookRules,
  handleFilePaths,
  validate,
  createBook
);

//GET ALL Book
route.get("/", queryRule, validate, getAllBook);

//GET Book by id
route.get("/:id", paramRule, validate, getBookById);

//UPDATE Book
route.put(
  "/:id",
  verifyToken,
  isAdmin,
  paramRule,
  updateRule,
  upload.single("cover"),
  validate,
  updateBook
);

//DELETE Book
route.delete("/:id", verifyToken, isAdmin, paramRule, validate, deleteBook);

export default route;
