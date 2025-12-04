import express from "express";
import {
  createGenre,
  deleteGenre,
  getAll,
  getById,
  updateGenre,
} from "../controllers/genreController.js";
import { verifyToken, isAdmin } from "../middleware/middleware.js";
import {
  genreBodyRules,
  genreIdParamRule,
  updateGenreBodyRules,
  validate,
} from "../validators/genreValidator.js";

const route = express.Router();

//CREATE Genre
route.post("/", verifyToken, isAdmin, genreBodyRules, validate, createGenre);

//GET ALL Genre
route.get("/", getAll);

//GET By ID Genre
route.get("/:id", verifyToken, isAdmin, genreIdParamRule, validate, getById);

//UPDATE Genre
route.put(
  "/:id",
  verifyToken,
  isAdmin,
  genreIdParamRule,
  updateGenreBodyRules,
  validate,
  updateGenre
);

//DELETE Genre
route.delete(
  "/:id",
  verifyToken,
  isAdmin,
  genreIdParamRule,
  validate,
  deleteGenre
);

export default route;
